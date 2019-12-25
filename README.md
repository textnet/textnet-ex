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
+ `text` support: full, lines, anchors


# NEXT ITERATION
- movement and actions
- support events


# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- another session of documentation
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

