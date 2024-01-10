---
title: 'Scene Stack'
description: 'Simple Scene Changing Pattern in Godot'
pubDate: 'Jan 10 2024'
heroImage: '/blog-placeholder-3.jpg'
---

### Why
The Scene Stack pattern is a simple pattern for managing Scenes within Godot. 

As the name implies we use a stack structure to store scenes and manage the scene changes ourself. Traditionally in Godot we change scenes with the following command
```gdscript
get_tree().change_scene_to_file("path/to/new/scene")
```
However a drawback with this approach is that it totally removes the previous scene from memory meaning that if we need to return to the previous scene it's instantiated from scratch. While this can be often the case we want - changing from an overworld to a town for example - there are times when it's beneficial to keep in memory where we came from - overworld to a battle and back to overworld.

### Code 
A simple Scene Stack can help manage this latter scenario at the cost of writing more bespoke code for your game. The code could look something like this
```gdscript
// scene_stack.gd

var stack := []

func push(next_scene_path: Node) -> void:

    // initialise useful variables
    var tree := get_tree()
    var root := tree.root
    var current_scene: Node = tree.current_scene
    
    // store the current scene on the stack for retrieval later
    stack.append(current_scene)
    root.remove_child(current_scene)

    // set new scene 
    var next_scene: Node = load(next_scene_path)
    tree.current_scene = next_scene

func pop() -> void:
    if stack.empty(): return
    var tree := get_tree()
    var root = tree.root

    // destroy current scene as not needed
    tree.current_scene.queue_free()

    // get the previous scene on the stack and activate it
    var previous_scene: Node = stack.pop_back()
    root.add_child(previous_scene)
```

```gdscript
// overworld.gd

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("ui_enter"):
        SceneStack.push("/path/to/battle.gd)
```

```gdscript 
// battle.gd
func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("ui_enter"):
        SceneStack.pop() // returns to overworld.gd
```


### Thoughts 

So the pros and cons. As we're removing and adding it to use add_child the pros and cons are as listed in the Change Scenes Tutorial.

> * Memory still exists (similar pros/cons as with hiding it from view).
> * Processing stops (similar pros/cons as with deleting it completely).
> * Pro: This variation of "hiding" it is much easier to show/hide. Rather than potentially keeping track of multiple changes to the scene, one must only call the one method add/remove_child pair of methods. It is similar to disabling game objects in other engines.
> * Con: Unlike with hiding it from view only, the data contained within the scene will become stale if it relies on delta time, input, groups, or other data that is derived from SceneTree access.

I'm also not super keen on the naming of functions as the mental model of a stack with push and pop is that we store and retrieve from the stack however push doesn't store the variable we pass through and pop doesn't return anything. Possibly could be considered Scene Layer or somethign with move_up_layer and move_down_layer. Not a critical thing to think about currently.

### Sources
[Godot Scene Changing Tutorial](https://docs.godotengine.org/en/stable/tutorials/scripting/change_scenes_manually.html)

[Heartbeast Turn-based RPG Tutorial - Paid](https://courses.heartgamedev.com/)