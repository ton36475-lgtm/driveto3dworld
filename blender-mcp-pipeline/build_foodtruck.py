"""Reference-informed reconstruction from six user images, with estimated dimensions.

User reference pixels establish visible features, not measured dimensions, OEM
identity, operating specifications or electrical/plumbing safety. Stored GLB has
closed approved joints; opening them is a runtime inspection pose only.
"""
import argparse
import json
import math
import random
import sys
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parent))
import bpy
from mathutils import Matrix, Vector
from build_assets import box as make_box, mesh as make_mesh, root, material, xyz, snapshot, write_json
from contract import digest, file_digest, inspect_glb, safe_output_directory
from reference_interior import build_interior

ROOT='FoodTruck_Body'
ANCHORS={'WheelAnchor_FL':(-.91,0,-1.94),'WheelAnchor_FR':(.91,0,-1.94),
         'WheelAnchor_RL':(-.96,0,1.52),'WheelAnchor_RR':(.96,0,1.52)}
JOINTS={'ServingHatch_Pivot':{'position':(1.045,2.39,1.04),'axis':'Z','openRadians':1.35},
        'OpposingHatch_Pivot':{'position':(-1.045,2.39,1.04),'axis':'Z','openRadians':-1.35}}
REFERENCE_NAMES=['01-1000077114.png','02-1000077115.png','03-1000077116.png','04-1000077117.png','05-1000077118.png','06-1000077120.png']


def role(obj,value):
    obj['material_role']=value
    return obj


def block(name,center,size,role_name='body',bevel=0):
    obj=role(make_box(name,center,size,truck,neutral),role_name)
    if bevel:
        bpy.context.view_layer.objects.active=obj
        modifier=obj.modifiers.new('Baked_edge_bevel','BEVEL'); modifier.width=bevel; modifier.segments=2
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def surface(name,vertices,faces,role_name='body'):
    return role(make_mesh(name,vertices,faces,truck,neutral),role_name)


def panel(name,vertices,role_name='body'):
    return surface(name,vertices,[tuple(range(len(vertices)))],role_name)


def tube(name,points,radius,role_name='black'):
    curve=bpy.data.curves.new(name+'_Curve','CURVE'); curve.dimensions='3D';curve.bevel_depth=radius
    curve.bevel_resolution=1;curve.resolution_u=1;curve.use_fill_caps=True
    spline=curve.splines.new('POLY');spline.points.add(len(points)-1)
    for point,target in zip(points,spline.points): target.co=(*xyz(point),1)
    obj=bpy.data.objects.new(name,curve);bpy.context.scene.collection.objects.link(obj);obj.parent=truck
    obj.data.materials.append(neutral);obj['material_role']=role_name
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
    bpy.ops.object.convert(target='MESH')
    return bpy.context.object


def cylinder(name,center,radius,depth,role_name='black',axis='Y',vertices=16):
    rotation=(0,0,0) if axis=='Y' else (0,math.pi/2,0) if axis=='X' else (math.pi/2,0,0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth,location=xyz(center),rotation=rotation)
    obj=bpy.context.object;obj.name=name;obj.parent=truck;obj.data.materials.append(neutral);obj['material_role']=role_name
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    return obj


def rotate_baked(obj,center,angle):
    pivot=Vector(xyz(center));rotation=Matrix.Rotation(angle,4,'X')
    for vertex in obj.data.vertices:vertex.co=pivot+rotation@(vertex.co-pivot)
    obj.data.update()


def attach_to_pivot(obj,pivot):
    # Bake inverse translation so glTF joint remains identity rotation in Y-up.
    for vertex in obj.data.vertices:vertex.co-=pivot.location
    obj.parent=pivot
    obj.location=(0,0,0)
    obj.data.update()


def fender(name,x,z,inner=.39,outer=.475):
    count=24; n=count+1
    vertices=[(x+offset,r*math.sin(math.pi*i/count),z+r*math.cos(math.pi*i/count))
              for offset in [-.055,.055] for r in [inner,outer] for i in range(n)]
    faces=[]
    for i in range(count):
        faces += [(i,i+1,n+i+1,n+i),(2*n+i,3*n+i,3*n+i+1,2*n+i+1),
                  (i,2*n+i,2*n+i+1,i+1),(n+i,n+i+1,3*n+i+1,3*n+i)]
    faces += [(0,n,3*n,2*n),(count,2*n+count,3*n+count,n+count)]
    return surface(name,vertices,faces,'body')


def octagonal_box(name,center,w,h,depth,role_name):
    x,y,z=center;cut=min(w,h)*.19
    shape=[(-w/2+cut,-h/2),(w/2-cut,-h/2),(w/2,-h/2+cut),(w/2,h/2-cut),
           (w/2-cut,h/2),(-w/2+cut,h/2),(-w/2,h/2-cut),(-w/2,-h/2+cut)]
    vertices=[(x+u,y+v,z+d) for d in [-depth/2,depth/2] for u,v in shape]
    faces=[tuple(reversed(range(8))),tuple(range(8,16))]+[(i,(i+1)%8,(i+1)%8+8,i+8) for i in range(8)]
    return surface(name,vertices,faces,role_name)


def create_hatch(name,side):
    cfg=JOINTS[name]; pivot=bpy.data.objects.new(name,None);bpy.context.scene.collection.objects.link(pivot)
    pivot.parent=truck;pivot.location=xyz(cfg['position']);pivot['runtime_joint']='hinged_serving_panel';pivot['glTF_axis']='Z'
    pivot['open_radians']=cfg['openRadians'];pivot['closed_radians']=0.0
    x=side*1.048; created=[]
    for suffix,center,size in [
        ('Top',(x,2.325,1.04),(.045,.13,2.24)),('Bottom',(x,1.43,1.04),(.045,.46,2.24)),
        ('Front',(x,1.98,-.033),(.045,.64,.094)),('Back',(x,1.98,2.113),(.045,.64,.094)),
        ('Divider',(x,1.98,1.04),(.045,.64,.15))]:
        created.append(block(name+'_'+suffix,center,size,'body',.008))
    for i,z in enumerate([.456,1.624]):
        width=.99
        for suffix,center,size in [
            ('Top',(x+side*.028,2.283,z),(.026,.025,width)),('Bottom',(x+side*.028,1.677,z),(.026,.025,width)),
            ('Front',(x+side*.028,1.98,z-width/2),(.026,.62,.025)),('Back',(x+side*.028,1.98,z+width/2),(.026,.62,.025))]:
            created.append(block(name+'_Window'+str(i)+'_'+suffix,center,size,'trim',.005))
        created.append(panel(name+'_Glass'+str(i),[(x+side*.003,1.70,z-.468),(x+side*.003,1.70,z+.468),
                         (x+side*.003,2.26,z+.468),(x+side*.003,2.26,z-.468)],'glass'))
        created.append(block(name+'_WindowDivider'+str(i),(x+side*.03,1.98,z),(.027,.56,.016),'black'))
    created.append(block(name+'_Handle',(x+side*.041,1.30,1.04),(.042,.044,.135),'black',.008))
    for z in [.02,1.04,2.08]:
        created.append(block(name+'_Latch'+str(z),(x+side*.038,1.21,z),(.040,.085,.06),'trim',.007))
    for obj in created:attach_to_pivot(obj,pivot)
    # Root-fixed narrow mounting frame; aperture stays hollow beneath the hatch.
    for z in [-.10,2.18]:block(name+'_FixedRail'+str(z),(side*1.026,1.80,z),(.028,1.26,.035),'black')
    block(name+'_FixedUpper',(side*1.026,2.406,1.04),(.030,.033,2.30),'trim')
    return pivot


def build_exterior():
    global truck,neutral
    bpy.ops.wm.read_factory_settings(use_empty=True);bpy.context.preferences.filepaths.save_version=0
    bpy.context.scene.unit_settings.system='METRIC';bpy.context.scene.unit_settings.scale_length=1
    truck=root(ROOT);truck['asset_contract']='foodtruck-reference-v2';truck['reference_informed']=True;truck['dimensions_measured']=False
    neutral=material('Mat_Reference_Structure',(.32,.32,.32),0,.76)
    block('Pickup_Chassis',(0,.12,-.05),(1.66,.17,5.17),'black',.02)
    block('Truck_Floor',(0,.59,1.14),(1.99,.10,2.64),'steelchecker')
    block('Camper_Front_Bulkhead',(0,1.25,-.177),(2.025,1.25,.04),'body')
    # Both sides are genuinely open; closed side glazing lives on articulated panels.
    for side in [-1,1]:
        tag='ReferenceSide' if side>0 else 'OpposingSide'
        block(tag+'_LowerWall',(side*1.016,.89,1.14),(.065,.61,2.62),'body',.018)
        block(tag+'_Header',(side*1.016,2.60,1.14),(.065,.33,2.62),'body',.018)
        block(tag+'_FrontPost',(side*1.016,1.80,-.15),(.065,1.23,.16),'body',.012)
        block(tag+'_RearPost',(side*1.016,1.80,2.34),(.065,1.23,.27),'body',.012)
        block(tag+'_SkirtFront',(side*1.007,.34,.47),(.078,.36,1.23),'body',.025)
        block(tag+'_SkirtRear',(side*1.007,.34,2.23),(.078,.36,.40),'body',.025)
        fender(tag+'_RearArch',side*1.017,1.52)
        block(tag+'_BottomTrim',(side*1.053,.58,1.14),(.025,.028,2.62),'trim')
        for z in [-.05,.82,2.32]:
            block(tag+'_ToolboxLatch'+str(z),(side*1.055,.39,z),(.023,.10,.085),'trim',.008)
        block(tag+'_LowerHatch_Handle',(side*1.058,.94,1.11),(.038,.042,.145),'black',.005)
        for z in [.0,1.09,2.20]:
            block(tag+'_LowerHatch_Hinge'+str(z),(side*1.055,.71,z),(.035,.055,.11),'trim',.004)
    # Main roof and cab-over pod: hollow bedroom with sloped nose.
    block('Camper_Roof',(0,2.766,.51),(2.085,.065,3.93),'body',.016)
    profile=[(1.90,-.18),(1.90,-1.80),(2.03,-1.93),(2.40,-1.93),(2.74,-1.43),(2.74,-.18)]
    for side in [-1,1]:
        panel('Cabover_Side_'+str(side),[(side*1.022,y,z) for y,z in profile],'body')
        block('Cabover_Side_Trim_'+str(side),(side*1.030,1.91,-1.0),(.02,.028,1.60),'trim')
        # Small side access panel visible in the exterior reference.
        block('Cabover_Side_Access_'+str(side),(side*1.034,2.34,-.74),(.025,.50,.76),'body',.017)
    panel('Cabover_FrontSlope',[(-1.035,2.74,-1.43),(1.035,2.74,-1.43),(1.035,2.40,-1.93),(-1.035,2.40,-1.93)],'body')
    panel('Cabover_Nose',[(-1.035,2.40,-1.93),(1.035,2.40,-1.93),(1.035,2.03,-1.93),(-1.035,2.03,-1.93)],'body')
    panel('Cabover_LowerBevel',[(-1.035,2.03,-1.93),(1.035,2.03,-1.93),(1.035,1.90,-1.80),(-1.035,1.90,-1.80)],'body')
    block('Cabover_Underside',(0,1.889,-1.0),(2.06,.038,1.64),'body',.014)
    for side in [-1,1]:
        tube('Roof_Rail_'+str(side),[(side*.997,2.837,-1.44),(side*.997,2.837,2.45)],.022,'trim')
        for z in [-1.20,-.1,1.05,2.35]:block('Roof_Rail_Mount_'+str(side)+'_'+str(z),(side*.997,2.808,z),(.058,.066,.085),'black')
    # Rear wall has a separate windowed entry, louvers and projected step.
    block('Rear_Left_Panel',(-.775,1.55,2.455),(.54,1.85,.060),'body',.014)
    block('Rear_Right_Panel',(.775,1.55,2.455),(.54,1.85,.060),'body',.014)
    block('Rear_Header',(0,2.55,2.455),(2.05,.41,.060),'body',.014)
    block('Rear_Sill',(0,.645,2.455),(1.98,.15,.060),'body')
    door=bpy.data.objects.new('RearDoor_Pivot',None);bpy.context.scene.collection.objects.link(door);door.parent=truck;door.location=xyz((-.47,.63,2.49))
    pieces=[]
    for suffix,center,size in [('Bottom',(0,1.0,2.494),(.94,.74,.032)),('Top',(0,2.20,2.494),(.94,.25,.032)),
                              ('Left',(-.437,1.72,2.494),(.065,.73,.032)),('Right',(.437,1.72,2.494),(.065,.73,.032))]:
        pieces.append(block('RearDoor_'+suffix,center,size,'body',.008))
    pieces.append(panel('RearDoor_Glass',[(-.398,1.385,2.50),(.398,1.385,2.50),(.398,2.06,2.50),(-.398,2.06,2.50)],'glass'))
    pieces.append(block('RearDoor_Handle',(.29,1.245,2.531),(.23,.036,.040),'trim',.008))
    for i in range(7):pieces.append(block('RearDoor_Louver_'+str(i),(0,.82+i*.055,2.531),(.76,.023,.055),'black'))
    for obj in pieces:attach_to_pivot(obj,door)
    block('Rear_Bumper',(0,.345,2.493),(2.10,.155,.12),'black',.018)
    block('Rear_Step',(0,.265,2.655),(1.50,.060,.43),'steelchecker',.018)
    for x in [-.53,.53]:block('Rear_Step_Support'+str(x),(x,.25,2.43),(.065,.065,.42),'black')
    for i,x in enumerate([-.78,.78]):
        block('Tail_Lamp_Housing_'+str(i),(x,.49,2.506),(.42,.19,.06),'black',.012)
        block('Lamp_Rear_'+str(i),(x,.49,2.543),(.27,.125,.026),'red',.008)
        block('Tail_Reverse_'+str(i),(x+(.145 if x<0 else -.145),.49,2.545),(.062,.12,.029),'white')
    # Ladder at the rear corner of the pictured serving side.
    for z in [2.02,2.39]:
        tube('Rear_Ladder_Rail_'+str(z),[(1.117,.75,z),(1.117,2.75,z),(1.103,2.86,z)],.024,'black')
    for i in range(8):tube('Rear_Ladder_Rung_'+str(i),[(1.12,.83+i*.25,2.02),(1.12,.83+i*.25,2.39)],.021,'black')
    # Distinct pickup cab and long square hood (not the earlier flat-front concept).
    block('Cab_Lower',(0,.59,-.82),(1.77,.77,1.34),'body',.055)
    block('Cab_Roof',(0,1.847,-.49),(1.79,.075,.68),'body',.028)
    block('Hood_Lower',(0,.865,-2.015),(1.74,.48,1.22),'body',.04)
    panel('Hood_Top',[(-.87,1.105,-2.635),(.87,1.105,-2.635),(.87,1.25,-1.395),(-.87,1.25,-1.395)],'body')
    panel('Windshield',[(-.77,1.24,-1.409),(.77,1.24,-1.409),(.77,1.796,-.795),(-.77,1.796,-.795)],'cab_glass')
    for x in [-.825,.825]:
        tube('Cab_Windscreen_Edge_'+str(x),[(x,1.21,-1.42),(x,1.825,-.775)],.033,'black')
        panel('Cab_Window_'+str(x),[(x*1.075,1.01,-1.25),(x*1.075,1.01,-.20),(x*1.075,1.76,-.20),(x*1.075,1.76,-.75)],'cab_glass')
        tube('Cab_Window_Trim_'+str(x),[(x*1.086,1.01,-1.25),(x*1.086,1.01,-.20),(x*1.086,1.76,-.20),(x*1.086,1.76,-.75),(x*1.086,1.01,-1.25)],.021,'black')
        tube('Door_Seam_'+str(x),[(x*1.086,.99,-1.25),(x*1.086,.30,-1.13),(x*1.086,.27,-.18),(x*1.086,1.70,-.18)],.013,'trim')
        block('Door_Handle_'+str(x),(x*1.102,.94,-.42),(.044,.045,.20),'black',.009)
        block('Mirror_Arm_'+str(x),(x*1.20,1.29,-1.15),(.19,.054,.075),'black',.012)
        block('Mirror_Housing_'+str(x),(x*1.32,1.30,-1.15),(.21,.19,.26),'body',.035)
        block('Mirror_Insert_'+str(x),(x*1.39,1.30,-1.15),(.012,.135,.19),'trim',.008)
        fender('Front_Fender_'+str(x),x*1.102,-1.94,.385,.49)
    tube('Windshield_Top',[(-.83,1.835,-.774),(.83,1.835,-.774)],.028,'black')
    tube('Windshield_Base',[(-.83,1.225,-1.417),(.83,1.225,-1.417)],.026,'black')
    for x in [-.39,.23]:tube('Wiper_'+str(x),[(x,1.26,-1.417),(x+.35,1.43,-1.235)],.012,'black')
    block('Front_Bumper',(0,.365,-2.733),(1.93,.31,.175),'black',.04)
    block('Front_Grille',(0,.845,-2.642),(.84,.34,.055),'black',.015)
    for i in range(3):block('Grille_Strip_'+str(i),(0,.738+i*.098,-2.682),(.79,.018,.023),'trim')
    for i,x in enumerate([-.68,.68]):
        octagonal_box('Headlamp_Surround_'+str(i),(x,.78,-2.65),.44,.43,.12,'black')
        octagonal_box('Headlamp_Bezel_'+str(i),(x,.78,-2.712),.328,.32,.034,'trim')
        octagonal_box('Lamp_Front_'+str(i),(x,.78,-2.735),.235,.22,.032,'white_light')
        block('Front_Amber_'+str(i),(x+(.158 if x>0 else -.158),.78,-2.717),(.026,.18,.023),'amber')
    for side in [-1,1]:
        for y in [.99,1.20]:block('Side_Indicator_'+str(side)+'_'+str(y),(side*.886,y,-1.52),(.028,.072,.10),'amber',.012)
    create_hatch('ServingHatch_Pivot',1);create_hatch('OpposingHatch_Pivot',-1)
    for name,position in ANCHORS.items():
        obj=bpy.data.objects.new(name,None);bpy.context.scene.collection.objects.link(obj);obj.parent=truck;obj.location=xyz(position);obj['runtime_only']=True
    build_interior({'box':block,'mesh':surface,'tube':tube})
    bpy.context.view_layer.update()


def texture_image():
    # Original procedural wood grain, not a crop from user reference photographs.
    width,height=512,256; rng=random.Random(1729); pixels=[]
    for y in range(height):
        v=y/height
        for x in range(width):
            u=x/width
            wave=math.sin(v*190 + 5*math.sin(u*11+v*8)+1.8*math.sin(u*23-v*7))
            fine=math.sin(v*710+2*math.sin(u*37))
            knot=math.sin(math.sqrt(((u-.31)*3)**2+((v-.56)*1.7)**2)*95)
            level=.50+.20*wave+.06*fine+.07*knot+.035*(rng.random()-.5)
            pixels.extend((.10+.39*level,.037+.19*level,.013+.065*level,1))
    image=bpy.data.images.new('Reference_Original_Wood_Grain',width=width,height=height,alpha=False)
    image.pixels.foreach_set(pixels);image.file_format='PNG';image.pack()
    return image


def checker_normal_image():
    """Original periodic diamond-plate normal tile; no reference pixels copied."""
    size=128; heights=[]
    for y in range(size):
        for x in range(size):
            u,v=(x+.5)/size,(y+.5)/size
            level=0.0
            for cx,cy,sign in [(.25,.25,1),(.75,.75,1),(.75,.25,-1),(.25,.75,-1)]:
                dx,dy=u-cx,v-cy
                along=(dx+sign*dy)/math.sqrt(2);across=(dy-sign*dx)/math.sqrt(2)
                level=max(level,max(0.0,1-abs(along)/.19-abs(across)/.047))
            heights.append(level)
    pixels=[]
    for y in range(size):
        for x in range(size):
            dx=(heights[y*size+(x+1)%size]-heights[y*size+(x-1)%size])*size*.025
            dy=(heights[((y+1)%size)*size+x]-heights[((y-1)%size)*size+x])*size*.025
            normal=Vector((-dx,-dy,1)).normalized();pixels.extend((normal.x*.5+.5,normal.y*.5+.5,normal.z*.5+.5,1))
    image=bpy.data.images.new('Reference_Original_Diamond_Plate',width=size,height=size,alpha=False)
    image.colorspace_settings.name='Non-Color';image.pixels.foreach_set(pixels);image.file_format='PNG';image.pack()
    return image


def add_uv(obj,scale=.78):
    uv=obj.data.uv_layers.new(name='UVMap')
    for poly in obj.data.polygons:
        dominant=max(range(3),key=lambda i:abs(poly.normal[i]));axes=[i for i in range(3) if i!=dominant]
        for loop_index in poly.loop_indices:
            co=obj.data.vertices[obj.data.loops[loop_index].vertex_index].co
            uv.data[loop_index].uv=(co[axes[0]]*scale,co[axes[1]]*scale)


def prepare_structure():
    # UVs and grouping are structural operations; finish them before taking baseline.
    for obj in list(bpy.context.scene.objects):
        if obj.type=='MESH':
            # Primitive generators may attach unused UVs. Keep only authored maps
            # so tangent export is portable without inflating every metal mesh.
            while obj.data.uv_layers:obj.data.uv_layers.remove(obj.data.uv_layers[0])
        if obj.type=='MESH' and obj.get('material_role')=='wood':add_uv(obj)
        if obj.type=='MESH' and obj.get('material_role')=='steelchecker':add_uv(obj,3.125)
    preserve={'Windshield','Lamp_Front_0','Lamp_Front_1','Lamp_Rear_0','Lamp_Rear_1','Serving_Counter','Interior_Sink_Basin'}
    parents=[truck]+[obj for obj in bpy.context.scene.objects if obj.type=='EMPTY' and obj.name.endswith('_Pivot')]
    for parent in parents:
        candidates=[obj for obj in parent.children if obj.type=='MESH' and obj.name not in preserve]
        roles=sorted({obj.get('material_role') for obj in candidates})
        for role_name in roles:
            parts=[obj for obj in parent.children if obj.type=='MESH' and obj.name not in preserve and obj.get('material_role')==role_name]
            if len(parts)<2:continue
            names=sorted(obj.name for obj in parts);bpy.ops.object.select_all(action='DESELECT')
            for obj in parts:obj.select_set(True)
            bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();obj=bpy.context.object
            obj.name=(parent.name if parent!=truck else 'Body')+'_'+role_name.capitalize();obj.data.name=obj.name+'_Geometry';obj['source_parts']=names
    bpy.context.view_layer.update()


def polish():
    palette={'body':((.029,.035,.045),.62,.23),'black':((.009,.011,.014),.20,.38),'gloss':((.008,.010,.013),.30,.13),
             'trim':((.32,.35,.39),.82,.22),'steel':((.52,.56,.60),.88,.25),'steelchecker':((.37,.40,.44),.87,.29),
             'wood':((.38,.17,.058),0,.39),'white':((.79,.80,.77),.06,.31),'curtain':((.49,.32,.08),.10,.38),
             'glass':((.27,.35,.36),0,.12),'cab_glass':((.032,.055,.065),.45,.14),
             'warm_light':((1,.53,.16),.0,.22),'white_light':((.87,.89,.88),.03,.2),
             'amber':((.57,.12,.013),.1,.24),'red':((.50,.009,.008),.1,.25)}
    materials={key:material('Mat_Reference_'+key,*value) for key,value in palette.items()}
    wood=texture_image();tree=materials['wood'].node_tree;node=tree.nodes.new('ShaderNodeTexImage');node.image=wood
    tree.links.new(node.outputs['Color'],tree.nodes.get('Principled BSDF').inputs['Base Color'])
    tree=materials['steelchecker'].node_tree;node=tree.nodes.new('ShaderNodeTexImage');node.image=checker_normal_image()
    normal=tree.nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.65
    tree.links.new(node.outputs['Color'],normal.inputs['Color']);tree.links.new(normal.outputs['Normal'],tree.nodes.get('Principled BSDF').inputs['Normal'])
    glass=materials['glass'];glass.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value=.30
    glass.surface_render_method='DITHERED';glass.use_transparency_overlap=False
    for key,power in [('warm_light',4.0),('white_light',1.1),('red',.4),('amber',.4)]:
        bsdf=materials[key].node_tree.nodes.get('Principled BSDF');bsdf.inputs['Emission Color'].default_value=(*palette[key][0],1);bsdf.inputs['Emission Strength'].default_value=power
    for obj in bpy.context.scene.objects:
        if obj.type=='MESH':
            key=obj.get('material_role');obj.data.materials.clear();obj.data.materials.append(materials[key])


def seal(objects):
    required={ROOT,'Windshield',*ANCHORS,*JOINTS}
    if missing:=required-set(objects):raise ValueError('Missing reference truck objects: '+str(sorted(missing)))
    return {'schemaVersion':2,'asset':'foodtruck-reference-v2','objects':objects,'structureHash':digest(objects),'approvedJoints':JOINTS}


def verify(baseline,objects):
    if baseline['structureHash']!=digest(baseline['objects']):raise ValueError('Baseline digest mismatch')
    changed=[name for name in sorted(set(objects)|set(baseline['objects'])) if objects.get(name)!=baseline['objects'].get(name)]
    if changed:raise ValueError('Truck structure changed: '+','.join(changed))
    return {'status':'PASS','objectsCompared':len(objects),'structureHash':baseline['structureHash']}


def source_bounds():
    points=[obj.matrix_world@Vector(corner) for obj in bpy.context.scene.objects if obj.type=='MESH' for corner in obj.bound_box]
    points=[(v.x,v.z,-v.y) for v in points]
    return {'min':[min(v[i] for v in points) for i in range(3)],'max':[max(v[i] for v in points) for i in range(3)]}


def add_preview_wheels():
    for x,y,z in ANCHORS.values():
        profile=[(.25,-.10),(.29,-.115),(.345,-.10),(.37,-.055),(.37,.055),(.345,.10),(.29,.115),(.25,.10)]
        count=40;vertices=[(x+axial,y+radius*math.sin(i*math.tau/count),z+radius*math.cos(i*math.tau/count)) for radius,axial in profile for i in range(count)]
        faces=[(ring*count+i,ring*count+(i+1)%count,((ring+1)%len(profile))*count+(i+1)%count,((ring+1)%len(profile))*count+i) for ring in range(len(profile)) for i in range(count)]
        tyre=surface('Preview_Tire',vertices,faces,'black')
        for polygon in tyre.data.polygons:polygon.use_smooth=True
        cylinder('Preview_Steel_Wheel',(x,y,z),.25,.185,'black','X',32)
        cylinder('Preview_Hub',(x,y,z),.078,.224,'black','X',20)
        side=-1 if x<0 else 1
        for i in range(8):
            a=i*math.tau/8
            cylinder('Preview_Bolt',(x+side*.115,.11*math.sin(a),z+.11*math.cos(a)),.012,.015,'trim','X',8)
    # New objects had neutral material; apply only known role assignments to preview wheels.
    for obj in bpy.context.scene.objects:
        if obj.name.startswith('Preview_') and obj.type=='MESH':
            obj.data.materials.clear();obj.data.materials.append(bpy.data.materials['Mat_Reference_'+obj['material_role']])


def render_previews(out):
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=40;scene.cycles.use_denoising=True
    scene.render.resolution_x=1280;scene.render.resolution_y=960;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='WEBP';scene.render.image_settings.color_mode='RGBA';scene.render.image_settings.quality=88
    scene.world=bpy.data.worlds.new('Preview_Studio');scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.16,.18,.22,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
    add_preview_wheels()
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.375));ground=bpy.context.object;ground.is_shadow_catcher=True
    ground.data.materials.append(material('Preview_Ground',(.045,.049,.055),0,.7))
    scene.render.film_transparent=True
    bpy.ops.object.camera_add(location=xyz((6.5,4.7,-7.3)));camera=bpy.context.object
    camera.rotation_euler=(Vector(xyz((0,1.28,-.05)))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type='ORTHO';camera.data.ortho_scale=7.3;scene.camera=camera
    for pos,power,size in [((3,6,-4),1800,5),((-4,4,-1),1500,4),((1,5,4),2100,5)]:
        bpy.ops.object.light_add(type='AREA',location=xyz(pos));light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size
        light.rotation_euler=(Vector(xyz((0,1.3,0)))-light.location).to_track_quat('-Z','Y').to_euler()
    for z in [.1,1.0,2.0]:
        bpy.ops.object.light_add(type='AREA',location=xyz((0,2.58,z)));light=bpy.context.object;light.data.energy=45;light.data.color=(1,.69,.37);light.data.size=.45
    scene.render.filepath=str(out/'foodtruck-preview.webp');bpy.ops.render.render(write_still=True)
    # Articulated inspection pose only. Never save it over locked source or GLB.
    for name,cfg in JOINTS.items():bpy.data.objects[name].rotation_euler.y=-cfg['openRadians']
    scene.render.film_transparent=False;ground.is_shadow_catcher=False
    camera.location=xyz((0,1.86,2.28));camera.rotation_euler=(Vector(xyz((0,1.82,-.65)))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type='PERSP';camera.data.lens=18;camera.data.sensor_width=32
    scene.render.filepath=str(out/'foodtruck-interior.webp');bpy.ops.render.render(write_still=True)
    camera.location=xyz((0,1.86,-.08));camera.rotation_euler=(Vector(xyz((0,1.52,2.31)))-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(out/'foodtruck-rear-interior.webp');bpy.ops.render.render(write_still=True)


def main(out,reference_dir):
    refs=[]
    for name in REFERENCE_NAMES:
        source=reference_dir/name
        if not source.is_file():raise ValueError('Missing supplied reference image: '+name)
        refs.append({'filename':name,'sha256':file_digest(source),'contentType':'image/jpeg','dimensions':[1536,1536]})
    out=safe_output_directory(out);build_exterior();prepare_structure();baseline=seal(snapshot())
    write_json(out/'foodtruck-baseline.json',baseline)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/'foodtruck-structural.blend'))
    polish();validation=verify(baseline,snapshot());bpy.ops.wm.save_as_mainfile(filepath=str(out/'foodtruck-final.blend'))
    bpy.ops.object.select_all(action='SELECT')
    result=bpy.ops.export_scene.gltf(filepath=str(out/'foodtruck-body.glb'),use_selection=True,export_format='GLB',export_yup=True,
          export_apply=True,export_tangents=True,export_cameras=False,export_lights=False,export_animations=False,export_extras=True)
    if 'FINISHED' not in result:raise RuntimeError('Reference foodtruck export failed')
    asset=inspect_glb(out/'foodtruck-body.glb',ROOT,max_asset_bytes=1_500_000,max_asset_triangles=45_000)
    report={'schemaVersion':2,'status':'PASS','asset':asset,'blenderVersion':bpy.app.version_string,'references':refs,
            'source':'Reference-informed reconstruction from six supplied images; scale and hidden geometry are estimates',
            'geometryAuthority':'User image features; no measured drawing or vehicle engineering verification',
            'externalAssets':[],'largeInventedBranding':False,'structureValidation':validation,'coordinateSystem':'metres, Y-up, front -Z; wheel-centre origin',
            'wheelAnchors':ANCHORS,'wheelRadius':.37,'wheelsExported':False,'bodyBounds':source_bounds(),'drawPrimitives':len(asset['primitiveBounds']),
            'approvedJoints':JOINTS,'budget':{'maxBytes':1_500_000,'maxTriangles':45_000,'reason':'Reference cab-over exterior, operable hatches, retained interior and portable wood texture'},
            'structuralSourceSha256':file_digest(out/'foodtruck-structural.blend'),'finalSourceSha256':file_digest(out/'foodtruck-final.blend'),
            'baselineSha256':file_digest(out/'foodtruck-baseline.json'),'generatorSha256':file_digest(__file__),
            'interiorGeneratorSha256':file_digest(Path(__file__).with_name('reference_interior.py')),
            'browserIntegration':'NOT_VERIFIED_BY_GENERATOR','humanApproval':'NOT_CLAIMED'}
    render_previews(out)
    report['previews']=[{'filename':n,'sha256':file_digest(out/n),'bytes':(out/n).stat().st_size,'width':1280,'height':960,
                        'transparent':n=='foodtruck-preview.webp','engine':'Blender Cycles CPU, 40 samples'} for n in ['foodtruck-preview.webp','foodtruck-interior.webp','foodtruck-rear-interior.webp']]
    write_json(out/'foodtruck-receipt.json',report)
    print('REFERENCE_FOODTRUCK_PASS '+str(out))


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',type=Path,required=True);parser.add_argument('--reference-dir',type=Path,required=True)
    args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    main(args.output_dir.resolve(),args.reference_dir.resolve())
