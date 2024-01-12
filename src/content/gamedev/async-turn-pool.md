---
title: 'Async Turn Pool'
description: 'Simple solution for managing multiple actions with a turn'
pubDate: 'Jan 12 2024'
heroImage: '/blog-placeholder-3.jpg'
---

### Why
Often times when using the await command along with animations in godot we can run into issues where we don't know which animations have finished. This can be annoying when we need to wait for them all to finish.
An example would be if we have a turn based game where a player hits an enemy, both the player's attack animation and the enemy's hit animation need to be finished before we can move onto the next turn. It wouldn't be unusual for both of these to finish at different times. If we don't account for this we could create weird situations where an enemy begins there attack animationn while their hit animation is incomplete. 

One simple solution is to use an AsyncTurnPool.

### Code 
In practice an AsyncTurnPool is just an array that we add actors to when their animations begin. We then remove actors from this pool when their animation is finished.

```gdscript
// AsyncTurnPool.gd
var pool := []
signal turn_over

func add(node: Node):
   pool.push(node)

func remove(node: Node):
    pool.erase(node)
    if pool.size() == 0: turn_over.emit()
```

```gdscript
// BattleManager.gd
// turn pool loaded as AutoLoad
func start_turns():
    start_player_turn()
    await AsyncTurnPool.turn_over

func start_player_turn():
    player_controller.do_turn_actions()()
    await AsyncTurnPool.turn_over
    start_enemy_turn()

func start_turns():
    enemy_controller.do_turn_actions()
    await AsyncTurnPool.turn_over
    start_player_turn()
```

```gdscript
// PlayerController.gd
do turn_actions():
    AsyncTurnPool.add(self)
    // play several animations
    AsyncTurnPool.remove(self)
```


### Thoughts 

That's 2 posts both on using arrays for management of game flow. Next one I'll try not to use an Array.

I think this is a useful pattern, it's quite flexible as we can add multiple items to it. We could add a screen shake too that needs to play and be waited on. It's not necessarily limited to animations but any actions that need to be performed before the next turn plays.


### Sources
[Heartbeast Turn-based RPG Tutorial - Paid](https://courses.heartgamedev.com/)