# Textnet Excalibur

This is an Excalibur-based prototype of the TXT NET

    npm install
    npm run dev

Proper distro will be done in Electron later.

# CONTROLS

+ Movement: UP, DOWN, LEFT, RIGHT
- Artifacts:
    + Enter: CTRL + (move)
    + Leave: ESC 
    + Push:  SHIFT + (move)
    + Pickup/putdown: ALT + (move)
- Written Word:
    - Enter: CTRL+ENTER (???)
    - Leave: CTRL+ENTER (???)
- Spoken Word:
    - Say: ENTER

# PLAN FOR TODAY

+ pickup/putdown
    + show the smaller version next to its holder
    + find space in the right direction
    + don't put down if there is no space



# SMALL THINGS TO PLAY WITH
- document
- animate entering the artifact
- animate leaving the artifact
- animate holding the artifact
- explore using 'touching' for colliders
- find the closes empty spot on "re-enter" 



// SOMEHOW WHEN SWITCHING SCENE OBJECTS ARE MOVED.
    - use only one scene (preferred)
    - ALSO: check for avatar teleportation in a separate cycle
    - ALSO: send networking updates in a separate cycle?

# PROJECT STRUCTURE

* [ ] Local Universe
* [ ] Basic written word (coding)
* [ ] Persistence / network game
* [ ] Spoken word / gods (commands)
* [ ] Hosted universes and proper multiplayer
* [ ] Integrated editor with text flow
* [ ] Advanced objects like images etc.


# Local Universe

* [x] Local account with planes and avatars
* [x] Player avatar
* [x] Artifacts
* [x] Enter/leave artifacts
* [ ] Pickup/put down artifacts
* [ ] Touch artifacts

# Basic Written Word

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

