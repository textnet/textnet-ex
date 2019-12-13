# Textnet Excalibur

This is an Excalibur-based prototype of the TXT NET

    npm install
    npm run dev

Proper distro will be done in Electron later.

# CONTROLS

- Movement: UP, DOWN, LEFT, RIGHT
- Artifacts:
    - Push:  (move towards artifact)
    - Pickup: SHIFT + (push)
    - Put down: SHIFT
    - Enter: CTRL + (push)
    - Leave: ESC 
- Written Word:
    - Enter: CTRL+ENTER
    - Leave: CTRL+ENTER
- Spoken Word:
    - Say: ENTER

# PLAN FOR TODAY

- migrate to only one scene
- scene change is a separate cycle
- networking updates — separate cycle = stop using timeouts
- check why do we have glitches
- diagonal movements
- move utils to utils


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
* [ ] Enter/leave artifacts
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

