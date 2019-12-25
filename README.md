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
+ define Written Word behaviour
+ plug-in text editor and support Enter/Leave w/o compilation
+ compilation and execution
    + extract WW chunks
    + learn how to run LUA interpreter
    + find a proper place to start compiling
    + recompile on entering: create observers
    + remove observers on purge
    + restart observer as it is adjusted
+ update text on screen if it is changed in universe


# NEXT ITERATION
- `get_artifact(s)` support
- `update` support with basic properties
- catch `name` as global variable
- `text` support, full, lines, anchors
- `update_avatar`
- support events


# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- refactor positions, coords, and vector stuff
- animate entering the artifact
- animate leaving the artifact
- animate holding the artifact
- find the closes empty spot on "re-enter" 
- embed lua highlighting into markdown


# PROJECT STRUCTURE

1. [x] Local Universe
2. [ ] Basic written word (coding)
3. [ ] Persistence / network game
4. [ ] Spoken word / gods (commands)
5. [ ] Hosted universes and proper multiplayer
6. [ ] Integrated editor with text flow
7. [ ] Advanced objects like images etc.


# 2. Basic Written Word

* [ ] Separate editor
* [ ] Properties
    - movable
    - pickable
    - passable
    - data
* [ ] Event handlers
    - touch
    - enter
    - leave
    - pickup
    - putdown
    - move
* [ ] Actions
    - log
    - move
* [ ] Control structures

