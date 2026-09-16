"""Render a comparison view from a loaded source; never save changed source geometry."""
import argparse
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument("--output", type=Path, required=True)
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
args.output.parent.mkdir(parents=True, exist_ok=True)
if args.output.exists():
    raise ValueError("Preview output already exists")

bpy.data.objects["Frame_Work"].location = (-1.45, 0.35, 1.0)
bpy.data.objects["Monogram_SxB"].location = (1.05, -0.02, 0.96)
bpy.data.objects["Plinth"].location = (1.05, 0, 0)
bpy.ops.mesh.primitive_plane_add(size=200, location=(0,0,-0.015))
ground = bpy.context.object
mat = bpy.data.materials.new("Preview_Ground")
mat.diffuse_color = (0.055,0.062,0.075,1)
ground.data.materials.append(mat)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = 1200
scene.render.resolution_y = 760
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(args.output.resolve())
scene.world = bpy.data.worlds.new("Preview_World")
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.12,0.14,0.19,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.45

bpy.ops.object.camera_add(location=(3.5,-7.5,3.2))
camera = bpy.context.object
camera.rotation_euler = (Vector((-0.2,0,0.8))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 5.45
scene.camera = camera
for location, power, size in [((-3,-4,5),850,4),((4,-1,4),650,3),((0,3,4),900,3)]:
    bpy.ops.object.light_add(type='AREA',location=location)
    light = bpy.context.object
    light.data.energy = power
    light.data.shape = 'DISK'
    light.data.size = size
    light.rotation_euler = (Vector((0,0,0.7))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.render.render(write_still=True)
