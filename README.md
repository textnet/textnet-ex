# Textnet Excalibur

This is an Excalibur-based prototype of the TXT NET

    npm install
    npm run dev

Proper distro will be done in Electron later.

# CONTROLS

+ Movement: UP, DOWN, LEFT, RIGHT
+ Artifacts:
    + Enter:  CTRL + (move)
    + Leave:  ESC 
    + Push:   SHIFT + (move)
    + Pickup: ALT + (move)
- Written Word:
    - Enter: CTRL+ENTER 
    - Leave: CTRL+ENTER / ESC
- Spoken Word:
    - Say: ENTER
- Self:
    - Enter yourself: CTRL+ESCAPE


# THIS ITERATION
- support events
    + timer(artifact, delta)
    + move(artifact, x,y, dx, dy, direction)
    + push(artifact, pusher, direction)
    + pickup(artifact, holder)
    + putdown(artifact, holder, x, y)
+ support `on('push')` syntax?
+ support `off{ artifact, event, value }`
+ embedded written word (working from inside of chairs)



# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- another session of documentation
- refactor positions, coords, and vector stuff
- animate entering the artifact
- animate leaving the artifact
- animate holding the artifact
- find the closes empty spot on "re-enter" 
- embed lua highlighting into markdown
- background & text colour overrides
- full-screen Electron distribution
- support closures in spatial commands
- `move_by{ distance=10, angle=45 }`
- position text cursors under avatar and vice versa
- travel in chairs
- supporting enter/leave events (complex)



# PROJECT STRUCTURE

1. [x] Local Universe
2. [x] Basic written word (coding)
3. [ ] Persistence / network game
4. [ ] Spoken word / gods (commands)
5. [ ] Hosted universes and proper multiplayer
6. [ ] Integrated editor with text flow
7. [ ] Advanced objects like images etc.


# 2. Basic Written Word

* [x] Separate editor
* [x] Getting and settings properties
* [x] Actions
    + move_to
    + move_by
    + place_at
* [±] Event handlers
    + push
    - enter
    - leave
    + pickup
    + putdown
    + move
* [x] Misc
    + print





----
* https://www.npmjs.com/package/bitboot