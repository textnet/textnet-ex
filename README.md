# Textnet Electron Excalibur

This is an Excalibur+Electron prototype of the TXTNET.

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
- Make Written Word work again
    + compile on start
    + compile on text-event
    - resupport all commands
        + move_to, move_by
        + get_artifact(s), get_myself
        + get_closest, get_next
        + update, self
        - text, line
    - Redo events
        - introduce roles
        - on: timer
        - on: move 
        - on: push/push-target (both actors)
        - on: pickup/pickup-target
        - on: putdown/putdown-target
        - on: enter/leave for world
        - on: enter/leave for artifact
- Redocument Written Word   

0. TIMER:   event happens all <objects>.
1. MOVE:    <object> is being moved (by another code, for example) in the <world>
2. PUSH:    <subject> pushes <object> in the <world>
3. PICKUP:  <subject> picks <object> up in the <world>
4. PUTDOWN: <subject> puts <object> down in the <world>
5. ENTER:   <object> is being entered into the <world> (e.g. by player or by another code)
6. LEAVE:   <object> is removed from the <world>

Which events happen when?
Events only happen if an observer is nearby.
Observer acts as <object>, <subject> or <world>
We have to supply `role` with each event.
Then here are options:
    
    on{ event="push", handler=custom_push } -- default role is <object> always
    on{ event="push", role="object", handler=custom_push }
    function custom_push(artifact, role, direction)
        -- body
    end



# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- BUG: scrolling text down while typing.
- excessive position submit (e.g. pickup)
- Apple Developer certificate
- another session of documentation
- refactor positions, coords, and vector stuff
- animate entering the artifact
- animate leaving the artifact
- animate holding the artifact
- embed lua highlighting into markdown
- background & text colour overrides
- WW: support closures in spatial commands
- WW: `move_by{ distance=10, angle=45 }`
- WW: travel in chairs <- learn how to put code into chairs, make bouncing chair
- WW: supporting enter/leave events (complex)
- beautiful sprites
- good naming
- WW: chaining move commands, iterate in the recipient of the command?



# 3 YEAR PROJECT PLAN (2019–2021)

1. [x] Universe basis                       2019 Q4 Nov +
2. [x] Basic Written world                  2019 Q4 Dec +
3. [>] Persistence                          2020 Q1 Jan
4. [ ] Spoken word / gods (commands)        2020 Q1 Feb
5. [ ] Hosted universes and multiplayer     2020 Q2 Apr
6. [ ] Make a reasonably interesting game   2020 H2 Sep
7. [ ] Integrated editor with text flow     2021 H1 May
8. [ ] Advanced objects like images etc.    2021 H2 Sep
9. [ ] Advanced concepts like <health>      2021 H2 Oct


# 3. Persistence

- [x] Electron distro
- [x] Serverside universe
- [x] Client-server protocol
- [>] Rightful observers and WW


# 4. Spoken word and gods
- [ ] Artifact libraries
- ... (plan further)

# 5. Multiplayer

- [ ] Messaging library
- [ ] Address space
- [ ] Simultaneous multiplayer





----
* https://www.npmjs.com/package/bitboot