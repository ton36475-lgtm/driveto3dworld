"""Photo-informed truck interior; dimensions are modelling assumptions in metres.

Reference: user photos 03-1000077116.png through 06-1000077120.png. These
show a stainless sink run, opposite work counter, white chest freezer, black
upper cabinets, timber lining, raised sleeping platform, folding ochre screen,
and warm fixtures. No dimensions were supplied, so this is a visual reference
reconstruction, not a surveyed fabrication model or electrical design.

Coordinate contract: glTF Y-up, vehicle front -Z; internal wall faces X +/-
0.99, working floor Y 0.62, ceiling 2.69. The bunk occupies Z -1.78..-0.25,
with its base above Y 1.93, clear of the host's cab roof and pod underside.
The forward ceiling follows an inset slope instead of penetrating the pod nose.
The host supplies box(name, center, size, role, bevel=0), mesh(name, vertices,
faces, role), and tube(name, points, radius, role). It owns parenting, materials,
unit conversion, joining, rendering and export. This module performs no I/O,
creates no cameras/lights/materials and does not modify external source files.

Material roles: wood, gloss, steel, black, white, warm_light, curtain,
steelchecker. Optional marker_red/marker_green/marker_blue roles are used only
when declared in api['roles']; otherwise existing visual roles provide contrast.
Suggested preserved source names: Interior_Ceiling, Interior_Bunk_Mattress,
Interior_Folding_Partition, Interior_Sink_Basin, Interior_Rear_AC.
"""

import math


def build_interior(api):
    """Build bounded interior source objects and return named reference handles."""
    box, mesh, tube = api["box"], api["mesh"], api["tube"]
    groups = {}
    roles = set(api.get("roles", ()))

    def marker_role(name, fallback):
        return name if name in roles else fallback

    def radial(name, center, axis, radius_a, radius_b, length, role, sides=12):
        """Capped frustum along any axis, using portable mesh geometry."""
        norm = math.sqrt(sum(c * c for c in axis))
        w = tuple(c / norm for c in axis)
        tangent = (0, 1, 0) if abs(w[1]) < 0.9 else (1, 0, 0)
        u = (w[1] * tangent[2] - w[2] * tangent[1],
             w[2] * tangent[0] - w[0] * tangent[2],
             w[0] * tangent[1] - w[1] * tangent[0])
        unorm = math.sqrt(sum(c * c for c in u))
        u = tuple(c / unorm for c in u)
        v = (w[1] * u[2] - w[2] * u[1],
             w[2] * u[0] - w[0] * u[2],
             w[0] * u[1] - w[1] * u[0])
        vertices = []
        for offset, radius in ((-length / 2, radius_a), (length / 2, radius_b)):
            for k in range(sides):
                angle = 2 * math.pi * k / sides
                vertices.append(tuple(center[i] + offset * w[i] + radius * (
                    math.cos(angle) * u[i] + math.sin(angle) * v[i])
                    for i in range(3)))
        faces = [tuple(reversed(range(sides))), tuple(range(sides, sides * 2))]
        faces.extend((k, (k + 1) % sides, (k + 1) % sides + sides, k + sides)
                     for k in range(sides))
        return mesh(name, vertices, faces, role)

    def grip(name, x, y, z, length=0.12, vertical=False):
        if vertical:
            points = [(x, y - length / 2, z), (x - 0.015, y - length / 2, z),
                      (x - 0.015, y + length / 2, z), (x, y + length / 2, z)]
        else:
            points = [(x, y, z - length / 2), (x - 0.015, y, z - length / 2),
                      (x - 0.015, y, z + length / 2), (x, y, z + length / 2)]
        return tube(name, points, 0.007, "steel")

    # Timber is thin lining around an open volume, never a solid room block.
    groups["ceiling"] = box("Interior_Ceiling", (0, 2.676, 0.4725),
                            (1.96, 0.026, 3.805), "wood")
    # Host roof rises from (Y2.40,Z-1.93) to (Y2.74,Z-1.43).
    # Both faces of this thin lining sit safely below that roof profile.
    mesh("Interior_Bunk_Sloped_Ceiling",
         [(-0.98, 2.438, -1.79), (0.98, 2.438, -1.79),
          (0.98, 2.663, -1.43), (-0.98, 2.663, -1.43),
          (-0.98, 2.464, -1.79), (0.98, 2.464, -1.79),
          (0.98, 2.689, -1.43), (-0.98, 2.689, -1.43)],
         [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1),
          (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)], "wood")
    box("Interior_Bunk_Front_Lining", (0, 2.197, -1.785),
        (1.96, 0.482, 0.022), "wood")
    for sign, side in ((-1, "Left"), (1, "Right")):
        # Side lining is a clipped prism matching the inset ceiling slope.
        profile = [(1.956, -1.78), (2.438, -1.78), (2.663, -1.43),
                   (2.663, -0.25), (1.956, -0.25)]
        vertices = [(x, y, z) for x in (sign * 0.965, sign * 0.987)
                    for y, z in profile]
        faces = [(4, 3, 2, 1, 0), (5, 6, 7, 8, 9)]
        faces.extend((k, (k + 1) % 5, (k + 1) % 5 + 5, k + 5) for k in range(5))
        mesh("Interior_Bunk_" + side + "_Lining", vertices, faces, "wood")
        box("Interior_Bunk_" + side + "_Opening_Jamb", (sign * 0.95, 2.295, -0.229),
            (0.036, 0.729, 0.045), "black")
        box("Interior_Front_" + side + "_Timber_Return", (sign * 0.93, 1.95, -0.088),
            (0.104, 1.32, 0.08), "wood")
    box("Interior_Bunk_Base", (0, 1.944, -1.012), (1.92, 0.028, 1.526), "wood")
    groups["mattress"] = box("Interior_Bunk_Mattress", (0, 2.013, -1.014),
                             (1.842, 0.110, 1.472), "black", bevel=0.024)
    box("Interior_Bunk_Sill", (0, 1.951, -0.234), (1.935, 0.040, 0.055), "black")
    box("Interior_Bunk_Fascia", (0, 1.956, -0.259), (1.92, 0.05, 0.033), "wood")
    # Below the pod, this bulkhead is behind the cab's rearmost Z=-.15 face.
    box("Interior_Lower_Bay_Timber_Panel", (0, 1.458, -0.114),
        (1.86, 0.904, 0.026), "wood")
    box("Interior_Bunk_Lower_LED", (0, 1.932, -0.234), (1.81, 0.004, 0.013), "warm_light")
    box("Interior_Bunk_Top_LED", (0, 2.639, -0.245), (1.82, 0.008, 0.014), "warm_light")

    # Low bench/storage and one visible timber step beneath the sleeping bay.
    box("Interior_Step_Bench", (0, 0.981, 0.05), (0.80, 0.034, 0.30), "wood", bevel=0.008)
    box("Interior_Bench_Front_Rail", (0, 0.953, 0.19), (0.80, 0.04, 0.02), "black")
    box("Interior_Bench_Base_Rail", (0, 0.650, -0.076), (0.80, 0.04, 0.035), "black")
    for idx in range(3):
        x = -0.263 + idx * 0.263
        box("Interior_Underbench_Storage_%02d" % idx, (x, 0.800, -0.078),
            (0.250, 0.271, 0.026), "gloss")
        box("Interior_Underbench_Seam_%02d" % idx, (x + 0.123, 0.8, -0.060),
            (0.009, 0.27, 0.011), "steel")
    box("Interior_Low_Wood_Step", (-0.248, 0.796, 0.05), (0.27, 0.035, 0.247), "wood")
    for x in (-0.38, 0.38):
        box("Interior_Bench_Leg_" + str(x), (x, 0.81, 0.176), (0.03, 0.28, 0.03), "black")

    # Mostly-open accordion screen: folded thin panels leave the bunk visible.
    verts, faces = [], []
    count = 14
    for idx in range(count):
        x0, x1 = -0.902 + idx * 0.024, -0.902 + (idx + 1) * 0.024
        z0 = -0.188 + (0.020 if idx % 2 else -0.020)
        z1 = -0.188 + (0.020 if (idx + 1) % 2 else -0.020)
        start = len(verts)
        verts.extend([(x0, 2.074, z0), (x1, 2.074, z1), (x1, 2.623, z1), (x0, 2.623, z0),
                      (x0, 2.074, z0 - 0.003), (x1, 2.074, z1 - 0.003),
                      (x1, 2.623, z1 - 0.003), (x0, 2.623, z0 - 0.003)])
        faces.extend(tuple(start + k for k in f) for f in
                     ((0, 1, 2, 3), (7, 6, 5, 4), (4, 5, 1, 0),
                      (3, 2, 6, 7), (0, 3, 7, 4), (1, 5, 6, 2)))
    groups["partition"] = mesh("Interior_Folding_Partition", verts, faces, "curtain")
    box("Interior_Partition_Lead_Edge", (-0.552, 2.348, -0.184),
        (0.027, 0.550, 0.068), "curtain", bevel=0.005)
    tube("Interior_Partition_Handle", [(-0.552, 2.26, -0.141), (-0.552, 2.27, -0.120),
         (-0.552, 2.40, -0.120), (-0.552, 2.41, -0.141)], 0.01, "curtain")
    box("Interior_Partition_Top_Track", (0, 2.65, -0.222), (1.92, 0.024, 0.079), "black")

    # Sink run: cabinet panels leave space for a genuinely recessed bowl.
    box("Interior_Sink_Cabinet_Base", (0.70, 0.694, 0.73), (0.54, 0.03, 1.54), "steel")
    box("Interior_Sink_Cabinet_Back", (0.965, 0.993, 0.73), (0.018, 0.58, 1.54), "steel")
    for z, label in ((-0.036, "Front"), (1.49, "Rear")):
        box("Interior_Sink_Cabinet_" + label, (0.70, 0.993, z), (0.54, 0.58, 0.018), "steel")
    for idx in range(3):
        z = 0.213 + idx * 0.509
        box("Interior_Sink_Sliding_Door_%02d" % idx, (0.421 - idx % 2 * 0.003, 0.992, z),
            (0.018, 0.551, 0.492), "steel", bevel=0.003)
        grip("Interior_Sink_Handle_%02d" % idx, 0.405, 1.016, z + 0.177, vertical=True)
    for x in (0.465, 0.935):
        for z in (0.01, 1.44):
            box("Interior_Sink_Foot_%.2f_%.2f" % (x, z), (x, 0.660, z),
                (0.035, 0.047, 0.038), "black")
    # Four worktop strips frame an open aperture X .48..92, Z .04..65.
    for name, center, size in (
        ("Inner_Rim", (0.45, 1.329, 0.73), (0.06, 0.022, 1.54)),
        ("Outer_Rim", (0.952, 1.329, 0.73), (0.064, 0.022, 1.54)),
        ("Front_Rim", (0.70, 1.329, 0.002), (0.44, 0.022, 0.076)),
        ("Worktop", (0.70, 1.329, 1.075), (0.44, 0.022, 0.85)),
    ):
        box("Interior_Sink_" + name, center, size, "steel", bevel=0.003)
    basin_vertices = [(0.48, 1.337, 0.04), (0.92, 1.337, 0.04),
                      (0.92, 1.337, 0.65), (0.48, 1.337, 0.65),
                      (0.54, 1.126, 0.10), (0.86, 1.126, 0.10),
                      (0.86, 1.126, 0.59), (0.54, 1.126, 0.59)]
    basin_faces = [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6),
                   (3, 0, 4, 7), (4, 5, 6, 7)]
    # Reverse all surfaces so the upward/open interior carries the front faces.
    basin_faces = [tuple(reversed(face)) for face in basin_faces]
    groups["sink"] = mesh("Interior_Sink_Basin", basin_vertices, basin_faces, "steel")
    radial("Interior_Sink_Drain", (0.70, 1.128, 0.37), (0, 1, 0), 0.031, 0.031, 0.004, "black")
    radial("Interior_Sink_Drain_Ring", (0.70, 1.131, 0.37), (0, 1, 0), 0.019, 0.019, 0.003, "steel")
    for idx in range(4):
        angle = idx * math.pi / 2
        radial("Interior_Drain_Perforation_%d" % idx,
               (0.70 + 0.011 * math.cos(angle), 1.133, 0.37 + 0.011 * math.sin(angle)),
               (0, 1, 0), 0.003, 0.003, 0.001, "black", sides=8)
    box("Interior_Sink_Upstand", (0.979, 1.367, 0.73), (0.014, 0.075, 1.54), "steel")
    faucet_points = [(0.945, 1.339, 0.363), (0.945, 1.56, 0.363)]
    faucet_points += [(0.83 + 0.115 * math.cos(math.pi * idx / 10),
                      1.56 + 0.115 * math.sin(math.pi * idx / 10), 0.363)
                     for idx in range(1, 11)]
    faucet_points.append((0.715, 1.528, 0.363))
    tube("Interior_Sink_Arched_Faucet", faucet_points, 0.012, "steel")
    radial("Interior_Faucet_Base", (0.945, 1.35, 0.363), (0, 1, 0), 0.026, 0.026, 0.018, "steel")
    tube("Interior_Faucet_Lever", [(0.943, 1.375, 0.421), (0.943, 1.391, 0.466)], 0.008, "steel")

    # Opposing stainless counter retains its characteristic exposed timber end.
    box("Interior_Opposing_Worktop", (-0.726, 1.263, 0.554),
        (0.529, 0.028, 1.455), "steel", bevel=0.006)
    box("Interior_Opposing_Counter_Base", (-0.726, 0.689, 0.554),
        (0.518, 0.030, 1.44), "steel")
    box("Interior_Opposing_Timber_End", (-0.726, 0.973, -0.166),
        (0.515, 0.540, 0.035), "wood")
    box("Interior_Opposing_Rear_End", (-0.726, 0.973, 1.274),
        (0.515, 0.540, 0.020), "steel")
    for idx in range(3):
        z = 0.076 + idx * 0.477
        box("Interior_Opposing_Door_%02d" % idx, (-0.458, 0.974, z),
            (0.018, 0.548, 0.464), "steel", bevel=0.003)
        tube("Interior_Opposing_Handle_%02d" % idx,
             [(-0.447, 0.999, z + 0.155), (-0.427, 0.999, z + 0.155),
              (-0.427, 1.102, z + 0.155), (-0.447, 1.102, z + 0.155)], 0.007, "steel")
    for x in (-0.967, -0.473):
        box("Interior_Opposing_End_Edge_%.2f" % x, (x, 0.973, -0.187),
            (0.020, 0.57, 0.020), "black")
        for z in (-0.12, 1.23):
            box("Interior_Opposing_Foot_%.2f_%.2f" % (x, z), (x, 0.659, z),
                (0.033, 0.046, 0.033), "black")

    # White chest freezer, no brand lettering or performance claims.
    box("Interior_Freezer_Gasket", (0.70, 1.363, 1.985), (0.553, 0.016, 0.653), "black")
    box("Interior_Freezer_Body", (0.70, 1.009, 1.985),
        (0.546, 0.695, 0.645), "white", bevel=0.016)
    box("Interior_Freezer_Lid", (0.70, 1.401, 1.985),
        (0.561, 0.058, 0.664), "white", bevel=0.010)
    grip("Interior_Freezer_Handle", 0.414, 1.332, 1.985, length=0.18)
    box("Interior_Freezer_Control_Plate", (0.425, 0.778, 2.183), (0.010, 0.119, 0.141), "white")
    radial("Interior_Freezer_Control_Dial", (0.417, 0.786, 2.183), (1, 0, 0),
           0.027, 0.027, 0.008, "steel", sides=16)
    for z, role in ((2.150, "warm_light"), (2.209, marker_role("marker_green", "black"))):
        radial("Interior_Freezer_Status_" + str(z), (0.418, 0.744, z), (1, 0, 0),
               0.005, 0.005, 0.010, role, sides=8)
    for z in (1.733, 2.237):
        box("Interior_Freezer_Lid_Hinge_" + str(z), (0.964, 1.374, z),
            (0.025, 0.075, 0.08), "steel")

    # Repeated glossy doors with a timber base and restrained mechanical detail.
    for sign, side in ((-1, "Left"), (1, "Right")):
        box("Interior_Upper_" + side + "_Carcass", (sign * 0.80, 2.473, 1.165),
            (0.356, 0.404, 2.055), "black")
        box("Interior_Upper_" + side + "_Soffit", (sign * 0.80, 2.262, 1.165),
            (0.372, 0.022, 2.065), "wood")
        box("Interior_Upper_" + side + "_LED", (sign * 0.606, 2.267, 1.165),
            (0.008, 0.012, 2.04), "warm_light")
        for idx in range(5):
            z = 0.353 + idx * 0.406
            box("Interior_Upper_%s_Door_%02d" % (side, idx),
                (sign * 0.611, 2.479, z), (0.018, 0.379, 0.389), "gloss", bevel=0.003)
            radial("Interior_Upper_%s_Knob_%02d" % (side, idx),
                   (sign * 0.586, 2.428, z + (0.15 if idx % 2 else -0.15)),
                   (1, 0, 0), 0.016, 0.016, 0.021, "black")
        for z, suffix in ((0.136, "Front"), (2.193, "Rear")):
            box("Interior_Upper_%s_%s_Timber_End" % (side, suffix),
                (sign * 0.80, 2.473, z), (0.358, 0.404, 0.018), "wood")
        box("Interior_Upper_" + side + "_Lower_Rail", (sign * 0.594, 2.279, 1.166),
            (0.025, 0.025, 2.09), "black")

    # Ceiling pucks and under-cabinet fixtures are emissive geometry, not lights.
    for idx, z in enumerate((-1.04, -0.05, 0.78, 1.67)):
        radial("Interior_Ceiling_Puck_Rim_%02d" % idx, (0, 2.651, z),
               (0, 1, 0), 0.075, 0.075, 0.022, "steel", sides=20)
        radial("Interior_Ceiling_Puck_Lens_%02d" % idx, (0, 2.638, z),
               (0, 1, 0), 0.061, 0.061, 0.008, "warm_light", sides=20)
    box("Interior_Spot_Track", (0.78, 2.234, 1.16), (0.037, 0.022, 2.02), "black")
    for idx, z in enumerate((0.24, 0.56, 0.88, 1.38, 1.70, 2.02)):
        tube("Interior_Spot_Stem_%02d" % idx, [(0.78, 2.23, z), (0.78, 2.178, z)], 0.01, "black")
        axis = (0.37, -0.929, 0)
        radial("Interior_Spot_Housing_%02d" % idx, (0.8, 2.119, z),
               axis, 0.040, 0.045, 0.118, "black")
        radial("Interior_Spot_Lens_%02d" % idx, (0.823, 2.061, z),
               axis, 0.036, 0.036, 0.006, "warm_light")
    for idx, z in enumerate((0.42, 1.49)):
        radial("Interior_Pendant_Mount_%02d" % idx, (-0.77, 2.238, z),
               (0, 1, 0), 0.046, 0.046, 0.018, "black")
        tube("Interior_Pendant_Stem_%02d" % idx, [(-0.77, 2.235, z), (-0.77, 2.160, z)], 0.011, "steel")
        radial("Interior_Pendant_Shade_%02d" % idx, (-0.77, 2.122, z),
               (0, 1, 0), 0.092, 0.028, 0.076, "black", sides=16)
        radial("Interior_Pendant_Underside_%02d" % idx, (-0.77, 2.081, z),
               (0, 1, 0), 0.075, 0.075, 0.005, "warm_light", sides=16)
        radial("Interior_Pendant_Bulb_%02d" % idx, (-0.77, 2.061, z),
               (0, 1, 0), 0.018, 0.024, 0.036, "warm_light")

    # Rear split AC and front breaker enclosures are visual, nonfunctional props.
    groups["ac"] = box("Interior_Rear_AC", (0, 2.428, 2.33),
                       (0.99, 0.343, 0.175), "white", bevel=0.025)
    box("Interior_AC_Outlet", (0, 2.291, 2.235), (0.878, 0.043, 0.015), "black")
    for idx in range(4):
        box("Interior_AC_Outlet_Louvre_%02d" % idx, (0, 2.276 + idx * 0.011, 2.223),
            (0.864, 0.004, 0.019), "white")
    radial("Interior_AC_Status", (0.371, 2.355, 2.237), (0, 0, 1),
           0.005, 0.005, 0.008, marker_role("marker_green", "warm_light"), sides=8)
    for unit, y in enumerate((2.065, 1.777)):
        box("Interior_Breaker_Enclosure_%02d" % unit, (0.861, y, -0.062),
            (0.122, 0.254, 0.20), "white", bevel=0.009)
        box("Interior_Breaker_Window_%02d" % unit, (0.791, y - 0.017, -0.062),
            (0.013, 0.09, 0.15), "black")
        for idx in range(5):
            z = -0.12 + idx * 0.028
            box("Interior_Breaker_Toggle_%d_%d" % (unit, idx), (0.780, y - 0.017, z),
                (0.017, 0.028, 0.016), marker_role("marker_red" if unit == 0 else "marker_green", "curtain" if unit == 0 else "steel"))
        box("Interior_Breaker_Label_%02d" % unit, (0.791, y + 0.085, -0.04),
            (0.014, 0.019, 0.063), marker_role("marker_blue", "steel"))
    box("Interior_Breaker_Indicator", (0.788, 2.155, -0.113),
        (0.014, 0.023, 0.031), marker_role("marker_blue", "warm_light"))
    box("Interior_Breaker_Lower_Socket", (0.867, 1.589, -0.061),
        (0.09, 0.067, 0.178), "steel", bevel=0.004)
    for z in (-0.103, -0.018):
        radial("Interior_Socket_Face_" + str(z), (0.814, 1.589, z),
               (1, 0, 0), 0.013, 0.013, 0.006, "black")

    # Modest floor panel seams complement the host's portable checker texture.
    box("Interior_Floor_Center_Seam", (0, 0.623, 1.17), (0.006, 0.004, 2.40), "black")
    for z in (0.47, 1.46):
        box("Interior_Floor_Cross_Seam_" + str(z), (0, 0.624, z),
            (0.84, 0.003, 0.006), "black")
    return groups
