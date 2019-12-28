# Textnet Excalibur

This is an Excalibur-based prototype of the TXT NET

    npm install
    ./start.sh

Uses Electron. To build DMG, use `yarn dist`

# CONTROLS

+ Movement: UP, DOWN, LEFT, RIGHT
+ Artifacts:
    + Enter:  CTRL + (move)
    + Leave:  ESC 
    + Push:   SHIFT + (move)
    + Pickup: ALT + (move)
- Written Word:
    + Enter: CTRL+ENTER 
    + Leave: CTRL+ENTER / ESC
- Spoken Word:
    - Say: ENTER
- Self:
    - Enter yourself: CTRL+ESCAPE


# THIS ITERATION
+ Electron
    + debug: left position
+ BUG: 1px shift when passing `passable=false` chair


# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- Apple Developer certificate
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
- refactor event processing (too much copy-paste?)
- enter yourself



# PROJECT STRUCTURE

1. [x] Local Universe
2. [x] Basic written word (coding)
3. [ ] Persistence / network game
4. [ ] Spoken word / gods (commands)
5. [ ] Hosted universes and proper multiplayer
6. [ ] Integrated editor with text flow
7. [ ] Advanced objects like images etc.


# 3. Persistence and Network Game

- [ ] Electron distro
- [ ] Messaging library
- [ ] Address space
- [ ] Serverside universe
- [ ] Client-server protocol
- [ ] Simultaneous multiplayer
- [ ] Rightful ovservers
- [ ] Artifact libraries







----
* https://www.npmjs.com/package/bitboot