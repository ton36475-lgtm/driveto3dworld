"""Original S×B food-studio CONCEPT vehicle; not a measured real-truck reconstruction.

Coordinates: metres, glTF Y-up, front -Z, root at wheel centre. Wheels are runtime
articulation and deliberately excluded. A neutral structure is sealed before a
material-only pass. Run in official Blender 4.5 LTS background mode.
"""
import argparse
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bpy
from mathutils import Matrix, Vector
from build_assets import box, mesh, root, material, xyz, snapshot, write_json
from contract import digest, file_digest, inspect_glb, safe_output_directory

ROOT = 'FoodTruck_Body'
ANCHORS = {'WheelAnchor_FL': (-0.95, 0, -1.12), 'WheelAnchor_FR': (0.95, 0, -1.12),
           'WheelAnchor_RL': (-0.95, 0, 1.0), 'WheelAnchor_RR': (0.95, 0, 1.0)}
# Original 5x7 block lettering, generated as geometry (no font download or texture).
GLYPHS = {
 'S':['01111','10000','10000','01110','00001','00001','11110'],
 'B':['11110','10001','10001','11110','10001','10001','11110'],
 '×':['00000','10001','01010','00100','01010','10001','00000'],
 'F':['11111','10000','10000','11110','10000','10000','10000'],
 'O':['01110','10001','10001','10001','10001','10001','01110'],
 'D':['11110','10001','10001','10001','10001','10001','11110'],
 'T':['11111','00100','00100','00100','00100','00100','00100'],
 'U':['10001','10001','10001','10001','10001','10001','01110'],
 'I':['11111','00100','00100','00100','00100','00100','11111'],
 'M':['10001','11011','10101','10101','10001','10001','10001'],
 'E':['11111','10000','10000','11110','10000','10000','11111'],
 'N':['10001','11001','11001','10101','10011','10011','10001'],
 ' ':['00000']*7,
}


def set_role(obj, role):
    obj['material_role'] = role
    return obj


def block(name, center, size, role='ink', bevel=0.0):
    obj = set_role(box(name, center, size, truck, neutral), role)
    if bevel:
        bpy.context.view_layer.objects.active = obj
        modifier = obj.modifiers.new('Authored_edge_bevel', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 1
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def panel(name, points, role='glass'):
    return set_role(mesh(name, points, [tuple(range(len(points)))], truck, neutral), role)


def rotate_baked(obj, center, angle):
    origin=Vector(xyz(center))
    rotation=Matrix.Rotation(angle,4,'X')
    for vertex in obj.data.vertices:
        vertex.co=origin+rotation@(vertex.co-origin)
    obj.data.update()


def bitmap_text(name, label, center, height, face='side', role='bone'):
    size = height/7
    total = (len(label)*6-1)*size
    vertices, faces = [], []
    cube_indices = [(0,3,2,1),(4,5,6,7),(0,1,5,4),(3,7,6,2),(0,4,7,3),(1,2,6,5)]
    for char_i, char in enumerate(label):
        for row, row_pixels in enumerate(GLYPHS[char]):
            for col, pixel in enumerate(row_pixels):
                if pixel != '1':
                    continue
                u = (char_i*6+col+0.5)*size-total/2
                v = (3-row)*size
                cx,cy,cz = center
                if face=='side':
                    location, dimensions = (cx,cy+v,cz-u), (.007,size*.93,size*.93)
                elif face=='front':
                    location, dimensions = (cx+u,cy+v,cz), (size*.93,size*.93,.007)
                else:
                    location, dimensions = (cx-u,cy+v,cz), (size*.93,size*.93,.007)
                start=len(vertices)
                vertices += [(location[0]+x*dimensions[0]/2,location[1]+y*dimensions[1]/2,location[2]+z*dimensions[2]/2)
                             for x,y,z in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
                faces += [tuple(start+i for i in face_indices) for face_indices in cube_indices]
    return set_role(mesh(name, vertices, faces, truck, neutral), role)


def fender(name, x, z):
    segments=16
    vertices=[]
    for offset in [-.02,.02]:
        for radius in [.338,.405]:
            vertices += [(x+offset,radius*math.sin(math.pi*i/segments),z+radius*math.cos(math.pi*i/segments)) for i in range(segments+1)]
    n=segments+1
    faces=[]
    for i in range(segments):
        faces += [(i,i+1,n+i+1,n+i),(2*n+i,3*n+i,3*n+i+1,2*n+i+1),
                  (i,2*n+i,2*n+i+1,i+1),(n+i,n+i+1,3*n+i+1,3*n+i)]
    faces += [(0,n,3*n,2*n),(segments,2*n+segments,3*n+segments,n+segments)]
    return set_role(mesh(name,vertices,faces,truck,neutral),'silver')


def merge_static_parts():
    """Reduce draw calls before sealing geometry; keep interactive contract meshes."""
    preserve={'Windshield','Serving_Counter','Brand_SxB','Brand_FoodStudio','Rear_Brand',
              'Menu_Panel','Menu_Title','Lamp_Front_0','Lamp_Front_1','Lamp_Rear_0','Lamp_Rear_1'}
    roles=sorted({obj.get('material_role') for obj in bpy.context.scene.objects if obj.type=='MESH'})
    for role in roles:
        parts=[obj for obj in bpy.context.scene.objects if obj.type=='MESH' and obj.get('material_role')==role and obj.name not in preserve]
        if len(parts)<2: continue
        names=sorted(obj.name for obj in parts)
        bpy.ops.object.select_all(action='DESELECT')
        for obj in parts: obj.select_set(True)
        bpy.context.view_layer.objects.active=parts[0]
        bpy.ops.object.join()
        obj=bpy.context.object
        obj.name='Body_'+role.capitalize()
        obj.data.name=obj.name+'_Geometry'
        obj['source_parts']=names


def build():
    global truck, neutral
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.preferences.filepaths.save_version=0
    bpy.context.scene.unit_settings.system='METRIC'
    bpy.context.scene.unit_settings.scale_length=1.0
    truck=root(ROOT)
    truck['asset_contract']='foodtruck-v1'
    truck['concept_only']=True
    truck['front_axis']='-Z (glTF)'
    neutral=material('Mat_Food_Structure',(.32,.32,.32),0,.75)
    # Floor and chassis leave tire clearances. All wheel geometry belongs to app.
    block('Chassis',(0,.19,0),(1.60,.11,3.30),'under',.012)
    block('Interior_Floor',(0,.31,.46),(1.77,.065,2.30),'silver')
    for x in [-.925,.925]:
        suffix='L' if x<0 else 'R'
        block('Sill_'+suffix,(x,.29,-.05),(.05,.19,1.37),'silver',.01)
        for z in [-1.12,1.0]:
            fender('Fender_'+suffix+('_F' if z<0 else '_R'),x,z)
    # Cargo box with real passenger-side serving aperture.
    block('Cargo_Driver_Wall',(-.925,1.25,.56),(.05,1.74,2.26),'ink',.012)
    block('Cargo_Rear_Wall',(0,1.25,1.665),(1.9,1.74,.065),'ink',.012)
    block('Cargo_Front_Wall',(0,1.25,-.555),(1.9,1.74,.055),'ink',.01)
    block('Cargo_Roof',(0,2.12,.56),(1.90,.06,2.28),'bone',.012)
    block('Hatch_Lower_Panel',(.925,.65,.52),(.05,.54,2.20),'ink',.012)
    block('Hatch_Header',(.925,1.905,.52),(.05,.39,2.20),'ink',.01)
    block('Hatch_Front_Pillar',(.925,1.315,-.49),(.05,.79,.14),'ink',.008)
    block('Hatch_Rear_Pillar',(.925,1.315,1.44),(.05,.79,.36),'ink',.008)
    # Trim outlines the actual opening (x~.95, y .92–1.71, z -.42–1.26).
    for name,center,size in [
        ('Hatch_Trim_Top',(.956,1.71,.42),(.022,.033,1.71)),
        ('Hatch_Trim_Bottom',(.956,.92,.42),(.022,.033,1.71)),
        ('Hatch_Trim_Front',(.956,1.315,-.43),(.022,.82,.033)),
        ('Hatch_Trim_Rear',(.956,1.315,1.27),(.022,.82,.033)),
    ]: block(name,center,size,'silver')
    block('Hatch_Fixed_Visor',(1.045,1.756,.42),(.25,.036,1.78),'bone',.008)
    block('Serving_Counter',(1.01,.955,.42),(.30,.045,1.77),'silver',.008)
    block('Counter_Front_Edge',(1.17,.93,.42),(.025,.075,1.80),'ink',.008)
    # Generic equipment forms without menu, pricing, product or operating claims.
    block('Interior_Back_Wall',(-.78,1.28,.52),(.035,1.66,2.04),'bone')
    block('Interior_Worktop',(.03,1.04,.43),(1.33,.065,1.91),'silver',.008)
    block('Cabinet_Base',(-.10,.685,.53),(1.02,.62,1.57),'bone',.01)
    for i,z in enumerate([.07,.62,1.17]):
        block('Cabinet_Door_'+str(i),(.421,.69,z),(.014,.48,.50),'bone')
        block('Cabinet_Handle_'+str(i),(.434,.86,z),(.018,.017,.20),'silver')
    block('Upper_Shelf',(-.43,1.62,.47),(.69,.035,1.85),'silver')
    for i,z in enumerate([-.13,.06,.25]):
        block('Storage_Canister_'+str(i),(-.37,1.75,z),(.15,.20,.14),'bone',.012)
    block('Counter_Appliance',(.06,1.225,.93),(.42,.31,.41),'under',.018)
    block('Appliance_Face',(.276,1.26,.93),(.02,.17,.31),'silver',.01)
    for i,z in enumerate([.82,.93,1.04]):
        block('Appliance_Control_'+str(i),(.29,1.255,z),(.014,.025,.027),'under')
    block('Interior_Light',(-.06,1.94,.39),(.05,.025,1.42),'lamp')
    # Cab: an actual sloping windscreen, narrow pillars and separate inset doors.
    block('Cab_Lower',(0,.565,-1.125),(1.83,.39,1.10),'ink',.025)
    block('Cab_Dash',(0,.94,-1.24),(1.65,.10,.37),'under',.015)
    block('Cab_Roof',(0,1.795,-.97),(1.88,.075,.70),'bone',.015)
    # Windscreen pane faces -Z; glass is opaque tinted PBR for robust mobile GLB.
    panel('Windshield',[(-.845,.925,-1.674),(.845,.925,-1.674),(.845,1.733,-1.295),(-.845,1.733,-1.295)],'glass')
    block('Windscreen_Top',(0,1.75,-1.30),(1.82,.065,.062),'silver',.006)
    block('Windscreen_Base',(0,.916,-1.658),(1.83,.052,.059),'silver',.006)
    centre=block('Windscreen_Centre',(0,1.34,-1.486),(.031,.90,.038),'silver')
    rotate_baked(centre,(0,1.34,-1.486),math.atan2(.379,.808))
    # Match the windscreen slope with baked pillar meshes.
    for x in [-.883,.883]:
        suffix='L' if x<0 else 'R'
        pillar=block('Cab_A_Pillar_'+suffix,(x,1.326,-1.484),(.068,.93,.065),'silver',.005)
        rotate_baked(pillar,(x,1.326,-1.484),math.atan2(.379,.808))
        block('Cab_Rear_Pillar_'+suffix,(x,1.285,-.628),(.075,1.03,.086),'ink',.008)
        panel('Cab_Window_'+suffix,[(x*1.055,.967,-1.56),(x*1.055,.967,-.68),(x*1.055,1.727,-.68),(x*1.055,1.727,-1.245)],'glass')
        block('Door_Trim_'+suffix,(x*1.057,.905,-1.10),(.025,.033,.86),'silver')
        block('Door_Handle_'+suffix,(x*1.066,.82,-.75),(.035,.035,.17),'silver',.005)
        block('Mirror_Arm_'+suffix,(x*1.10,1.26,-1.25),(.20,.032,.037),'silver')
        block('Mirror_Housing_'+suffix,(x*1.205,1.27,-1.25),(.087,.22,.17),'ink',.015)
        block('Mirror_Glass_'+suffix,(x*1.25,1.27,-1.25),(.012,.175,.125),'silver')
        block('Seat_'+suffix,(x*.62,.95,-.90),(.40,.38,.37),'under',.025)
    # Functional trim, lamp meshes, and abstract identity (no license-plate text).
    block('Front_Bumper',(0,.285,-1.697),(1.87,.16,.072),'silver',.014)
    block('Front_Grille',(0,.565,-1.685),(.98,.235,.028),'under',.012)
    for i in range(5): block('Grille_Slat_'+str(i),(0,.475+i*.043,-1.706),(.87,.013,.018),'silver')
    for i,x in enumerate([-.655,.655]):
        block('Lamp_Front_'+str(i),(x,.645,-1.701),(.31,.16,.055),'lamp',.015)
        block('Front_Indicator_'+str(i),(x,.442,-1.698),(.135,.037,.042),'bone',.005)
        block('Lamp_Rear_'+str(i),(x,.60,1.705),(.09,.27,.025),'red',.012)
    block('Rear_Bumper',(0,.26,1.708),(1.87,.15,.082),'silver',.012)
    block('Rear_Door_Left',(-.445,1.25,1.705),(.77,1.52,.013),'ink')
    block('Rear_Door_Right',(.445,1.25,1.705),(.77,1.52,.013),'ink')
    block('Rear_Centre_Seam',(0,1.25,1.718),(.026,1.54,.021),'silver')
    for x in [-.82,.82]:
        for y in [.72,1.65]: block('Rear_Hinge_'+str(x)+'_'+str(y),(x,y,1.72),(.055,.11,.021),'silver')
    # S×B FOOD STUDIO is a concept identity, not a third-party mark or real menu.
    bitmap_text('Brand_SxB','S×B',(.960,1.93,.20),.22)
    bitmap_text('Brand_FoodStudio','FOOD STUDIO',(.96,.64,.20),.10)
    block('Menu_Panel',(.96,1.32,1.438),(.024,.61,.255),'under',.008)
    bitmap_text('Menu_Title','MENU',(.982,1.535,1.438),.06)
    for i,length in enumerate([.155,.120,.150,.135]):
        block('Menu_Abstract_Line_'+str(i),(.984,1.395-i*.068,1.431),(.008,.014,length),'bone')
    bitmap_text('Rear_Brand','S×B',(0,1.525,1.725),.21,'rear')
    # Dark roof vent and nonfunctional original industrial details.
    block('Roof_Vent',(0,2.167,.80),(.57,.074,.59),'under',.012)
    for i in range(5): block('Roof_Vent_Slat_'+str(i),(-.20+i*.10,2.207,.8),(.012,.014,.47),'silver')
    for name,position in ANCHORS.items():
        obj=bpy.data.objects.new(name,None)
        bpy.context.scene.collection.objects.link(obj)
        obj.parent=truck
        obj.location=xyz(position)
        obj['runtime_only']=True
    merge_static_parts()
    bpy.context.view_layer.update()


def polish():
    palette={'ink':((.012,.014,.019),.45,.33),'under':((.006,.007,.010),.12,.56),
             'bone':((.78,.755,.69),.18,.47),'silver':((.55,.59,.63),.86,.24),
             'glass':((.042,.082,.100),.62,.16),'lamp':((.88,.86,.79),.10,.25),
             'red':((.42,.018,.012),.20,.28)}
    materials={key:material('Mat_Food_'+key,*value) for key,value in palette.items()}
    for key,power in [('lamp',1.2),('red',.5)]:
        bsdf=materials[key].node_tree.nodes.get('Principled BSDF')
        bsdf.inputs['Emission Color'].default_value=(*palette[key][0],1)
        bsdf.inputs['Emission Strength'].default_value=power
    for obj in bpy.context.scene.objects:
        if obj.type=='MESH':
            obj.data.materials.clear()
            obj.data.materials.append(materials[obj['material_role']])


def seal(objects):
    required={ROOT,'Windshield','Serving_Counter','Brand_SxB',*ANCHORS}
    if missing:=required-set(objects): raise ValueError('Missing truck objects: '+str(sorted(missing)))
    return {'schemaVersion':1,'asset':'foodtruck-body','objects':objects,'structureHash':digest(objects)}


def verify(baseline, objects):
    if baseline['structureHash']!=digest(baseline['objects']): raise ValueError('Baseline digest mismatch')
    changed=[name for name in sorted(set(objects)|set(baseline['objects'])) if objects.get(name)!=baseline['objects'].get(name)]
    if changed: raise ValueError('Truck structure changed: '+','.join(changed))
    return {'status':'PASS','objectsCompared':len(objects),'structureHash':baseline['structureHash']}


def render_preview(path):
    # Snapshot before preview additions; no render-only geometry is saved/exported.
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.335))
    bpy.context.object.data.materials.append(material('Preview_Ground',(.035,.039,.048),.1,.70))
    bpy.context.object.is_shadow_catcher=True
    for x,y,z in ANCHORS.values():
        bpy.ops.mesh.primitive_cylinder_add(vertices=20,radius=.32,depth=.22,location=xyz((x,y,z)),rotation=(0,math.pi/2,0))
        bpy.context.object.data.materials.append(material('Preview_Tire',(.007,.008,.010),0,.85))
        bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=.19,depth=.225,location=xyz((x,y,z)),rotation=(0,math.pi/2,0))
        bpy.context.object.data.materials.append(material('Preview_Rim',(.40,.44,.49),.85,.24))
    scene=bpy.context.scene
    scene.render.engine='CYCLES'; scene.cycles.device='CPU'; scene.cycles.samples=32; scene.cycles.use_denoising=True
    scene.render.resolution_x=1280; scene.render.resolution_y=960; scene.render.resolution_percentage=100
    scene.render.film_transparent=True
    scene.render.image_settings.file_format='WEBP'; scene.render.image_settings.color_mode='RGBA'
    scene.render.image_settings.quality=88; scene.render.filepath=str(path)
    scene.world=bpy.data.worlds.new('Preview_World'); scene.world.use_nodes=True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.11,.13,.17,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.55
    bpy.ops.object.camera_add(location=xyz((5.3,3.9,-6.8)))
    camera=bpy.context.object; camera.rotation_euler=(Vector(xyz((0,.92,0)))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type='ORTHO'; camera.data.ortho_scale=6.0; scene.camera=camera
    for position,power,size in [((3,5,-4),1300,5),((-4,4,-1),900,4),((1,5,4),1600,4)]:
        bpy.ops.object.light_add(type='AREA',location=xyz(position));light=bpy.context.object
        light.data.energy=power;light.data.shape='DISK';light.data.size=size
        light.rotation_euler=(Vector(xyz((0,1,0)))-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.render.render(write_still=True)


def main(out):
    out=safe_output_directory(out)
    build()
    baseline=seal(snapshot())
    write_json(out/'foodtruck-baseline.json',baseline)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/'foodtruck-structural.blend'))
    polish()
    verification=verify(baseline,snapshot())
    bpy.ops.wm.save_as_mainfile(filepath=str(out/'foodtruck-final.blend'))
    bpy.ops.object.select_all(action='SELECT')
    result=bpy.ops.export_scene.gltf(filepath=str(out/'foodtruck-body.glb'),use_selection=True,export_format='GLB',export_yup=True,
                                   export_apply=True,export_cameras=False,export_lights=False,export_animations=False,export_extras=True)
    if 'FINISHED' not in result: raise RuntimeError('Foodtruck export failed')
    asset=inspect_glb(out/'foodtruck-body.glb',ROOT)
    # All body mesh transforms are baked except authored pillar rotation. Measure
    # complete world bounds in the source for the explicit runtime contract.
    coords=[obj.matrix_world@Vector(corner) for obj in bpy.context.scene.objects if obj.type=='MESH' for corner in obj.bound_box]
    gltf_coords=[(c.x,c.z,-c.y) for c in coords]
    bounds={'min':[min(p[i] for p in gltf_coords) for i in range(3)],'max':[max(p[i] for p in gltf_coords) for i in range(3)]}
    report={'schemaVersion':1,'status':'PASS','asset':asset,'blenderVersion':bpy.app.version_string,
            'source':'Original procedural S×B food-studio CONCEPT; no actual truck photographs or dimensions supplied',
            'externalAssets':[],'geometryAuthority':'Authored concept contract, not a survey or fabricated customer story',
            'structureValidation':verification,'coordinateSystem':'metres, Y-up, front -Z, root at wheel-centre height',
            'wheelAnchors':ANCHORS,'wheelRadius':.32,'wheelsExported':False,'bodyBounds':bounds,
            'drawPrimitives':len(asset['primitiveBounds']),
            'structuralSourceSha256':file_digest(out/'foodtruck-structural.blend'),
            'finalSourceSha256':file_digest(out/'foodtruck-final.blend'),'baselineSha256':file_digest(out/'foodtruck-baseline.json'),
            'generatorSha256':file_digest(__file__),'browserIntegration':'NOT_VERIFIED_BY_GENERATOR','humanApproval':'NOT_CLAIMED'}
    preview=out/'foodtruck-preview.webp'
    render_preview(preview)
    report['renderPreview']={'filename':preview.name,'sha256':file_digest(preview),'bytes':preview.stat().st_size,
                             'width':1280,'height':960,'transparent':True,'engine':'Blender Cycles CPU, 32 samples'}
    write_json(out/'foodtruck-receipt.json',report)
    print('FOODTRUCK_PASS '+str(out))


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',type=Path,required=True)
    args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    main(args.output_dir.resolve())
