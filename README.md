# Textnet Electron Excalibur

This is an Excalibur+Electron prototype of the TXT NET.

## Debug cycle
    npm install
    ./start.sh

## Make installation package
    yarn dist

# CONTROLS

+ Movement: UP, DOWN, LEFT, RIGHT
+ Artifacts:
    + Enter:  CTRL  + (move)
    + Leave:  ESC 
    + Push:   SHIFT + (move)
    + Pickup: ALT   + (move)
+ Written Word:
    + Enter: CTRL+ENTER 
    + Leave: CTRL+ENTER / ESC
- Spoken Word:
    - Say: ENTER
- Self:
    - Enter yourself: CTRL + ESCAPE


# THIS ITERATION
+ Persistence storage for accounts and artifacts
+ Move setup to persistence
- Event handling with no dependencies on Excalibur
    + remove all ex.Events
    + make sure there is no dependencies in Universe on ex
    + research interop
    + move all presentation to presentation, including manipulations
    + emit interop events from manipulations
    - fix things back
        + moving
        + collisions
        + pushing
        + pickup/putdown
        - enter/leave
            - show inventory after enter w/pickup
            - enter->enter losing target world

# NEXT ITERATION
- Make Written Word work again


# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- excessive position submit (e.g. pickup)
- validate bounds when working with artifacts
- Apple Developer certificate
- another session of documentation
- refactor positions, coords, and vector stuff
- animate entering the artifact
- animate leaving the artifact
- animate holding the artifact
- find the closes empty spot on "re-enter" 
- position text cursors under avatar and vice versa
- embed lua highlighting into markdown
- background & text colour overrides
- WW: support closures in spatial commands
- WW: `move_by{ distance=10, angle=45 }`
- WW: travel in chairs <- learn how to put code into chairs, make bouncing chair
- WW: supporting enter/leave events (complex)



# PROJECT STRUCTURE

1. [x] Local Universe
2. [x] Basic written word (coding)
3. [>] Persistence 
4. [ ] Spoken word / gods (commands)
5. [ ] Hosted universes and proper multiplayer
6. [ ] Integrated editor with text flow
7. [ ] Advanced objects like images etc.


# 3. Persistence

- [x] Electron distro
- [x] Serverside universe
- [x] Client-server protocol
- [x] Rightful observers


# 4. Spoken word and gods
- [ ] Artifact libraries
- ...   x

# 5. Multiplayer

- [ ] Messaging library
- [ ] Address space
- [ ] Simultaneous multiplayer





----
* https://www.npmjs.com/package/bitboot