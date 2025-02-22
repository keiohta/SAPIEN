# SAPIEN: A SimulAted Part-based Interactive ENvironment
SAPIEN is a realistic and physics-rich simulated environment that hosts a
large-scale set for articulated objects. It enables various robotic vision and
interaction tasks that require detailed part-level understanding. SAPIEN is a
collaborative effort between researchers at UCSD, Stanford and SFU. The dataset
is a continuation of ShapeNet and PartNet.

## Change Log

### 1 to 2 migration guide
- replace `scene.renderer_scene.add_xxx_light` with `scene.add_xxx_light`
- replace `scene.remove_mounted_camera` with `scene.remove_camera`
- optionally, remove `fovx` from `scene.add_mounted_camera`.

### 2.0
- Refactor light system
  - Remove light functions on scene.renderer_scene
- Refactor camera system
  - Cameras no longer require mounts
  - Camera can change its mount and mounted pose by `camera.set_parent` and
    `camera.set_local_pose`.
  - When camera is not mounted, setting local pose is setting its global pose.
  - Add functions `scene.add_camera` and `scene.remove_camera`
  - `add_mounted_camera` can be replaced with `add_camera` followed by
    `camera.set_parent` and `camera.set_local_pose`. `add_mounted_camera` is
    still provided but fovx should not longer be provided.
  - Remove functions related to mount, including `find_camera_by_mount`.
  - Cameras now support full camera parameters through `camera.near`,
    `camera.far`, `camera.set_fovx`, `camera.set_fovy`,
    `camera.set_focal_lengths`, `camera.set_principal_point`, `camera.skew`, and
    the all-in-one method `camera.set_perspective_parameters`.
- Refactor render shape system
  - Originally, after `actor.get_visual_bodies()` and
    `visual_body.get_render_shapes()`, users typically do `shape.scale` and
    `shape.pose`. These are no longer valid. It is required to check
    `visual_body.type`. When `type` is `mesh`, `shape.scale` is replaced with
    `visual_body.scale` and `shape.pose` is replaced by
    `visual_body.local_pose`. These changes are made to match `add_visual_shape`
    functions when building the actor.

### 1.2
- Shader change: 4th component in default camera shader now gives the 0-1 depth value.
- Add "critical" and "off" log levels.
- Add support for pointcloud and line rendering (for visualizing camera and point cloud)
- Performance: the same shader only compile once per process
- Bug fix
  - Articulation setDriveTarget was now correctly reversed for prismatic joint (joint setDriveTarget is not affected)
  - Fix kinematic articulation loader

### 1.1
- Support nonconvex static/kinematic collision shape
- Add warning for small mass/inertia
- Introduce Entity as the base class of Actors
- Add Light classes inherited from entity, allowing manipulate light objects in sapien scene
- Updates to the viewer
  - rename actor to entity when appropriate
- Partial support the material tag in URDF loader (primitive shape, single color)
- Bug fixes for the renderer
- Support inner and outer FOV for spotlight

### 1.0
- Replace the old Vulkan based renderer completely
  - See `sapien.core.renderer` for details
- Expose GUI functionalities to Python
- Reimplement Vulkan viewer in Python 
- Expose PhysX shape wrapper to Python. For example,
  - Collision shapes can be retrieved through `actor.get_collision_shapes`
  - Collision groups on a shape can be set by `CollisionShape.set_collision_groups`
  - Shapes are now also available in `Contact`.
- API changes
  - Render material creation is now `renderer.create_material()`
  - in actor builder: `add_xxx_shape` is replaced with `add_xxx_collision`.
  - move light functions from scene to `scene.renderer_scene`
- Add centrifugal and Coriolis force.
- Change default physical parameters for better stability.

## SAPIEN Engine
SAPIEN Engine provides physical simulation for articulated objects. It powers
reinforcement learning and robotics with its pure Python interface.

## SAPIEN Renderer
SAPIEN provides rasterized and ray traced rendering with Vulkan.

## PartNet-Mobility
SAPIEN releases PartNet-Mobility dataset, which is a collection of 2K
articulated objects with motion annotations and rendernig material. The dataset
powers research for generalizable computer vision and manipulation.

## Website and Documentation
SAPIEN Website: [https://sapien.ucsd.edu/](https://sapien.ucsd.edu/). SAPIEN
Documentation:
[https://sapien.ucsd.edu/docs/latest/index.html](https://sapien.ucsd.edu/docs/latest/index.html).

## Build from source
### Before build
Make sure all submodules are initialized `git submodule update --init --recursive`.

### Build with Docker
To build SAPIEN, simply run `./docker_build_wheels.sh`. It is not recommended to
build outside of our provided docker.

For reference, the Dockerfile is provided [here](/docker/Dockerfile). Note that
PhysX needs to be compiled with clang-9 into static libraries before building
the Docker image.

### Build without Docker
It can be tricky to setup all dependencies outside of a Docker environment. You
need to install all dependencies according to the [Docker
environment](/docker/Dockerfile). If all dependencies set up correctly, run
`python setup.py bdist_wheel` to build the wheel.

## Cite SAPIEN
If you use SAPIEN and its assets, please cite the following works.
```
@InProceedings{Xiang_2020_SAPIEN,
author = {Xiang, Fanbo and Qin, Yuzhe and Mo, Kaichun and Xia, Yikuan and Zhu, Hao and Liu, Fangchen and Liu, Minghua and Jiang, Hanxiao and Yuan, Yifu and Wang, He and Yi, Li and Chang, Angel X. and Guibas, Leonidas J. and Su, Hao},
title = {{SAPIEN}: A SimulAted Part-based Interactive ENvironment},
booktitle = {The IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
month = {June},
year = {2020}}
```
```
@InProceedings{Mo_2019_CVPR,
author = {Mo, Kaichun and Zhu, Shilin and Chang, Angel X. and Yi, Li and Tripathi, Subarna and Guibas, Leonidas J. and Su, Hao},
title = {{PartNet}: A Large-Scale Benchmark for Fine-Grained and Hierarchical Part-Level {3D} Object Understanding},
booktitle = {The IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
month = {June},
year = {2019}
}
```
```
@article{chang2015shapenet,
title={Shapenet: An information-rich 3d model repository},
author={Chang, Angel X and Funkhouser, Thomas and Guibas, Leonidas and Hanrahan, Pat and Huang, Qixing and Li, Zimo and Savarese, Silvio and Savva, Manolis and Song, Shuran and Su, Hao and others},
journal={arXiv preprint arXiv:1512.03012},
year={2015}
}
```
