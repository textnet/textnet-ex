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

# Messaging Across Network
- Peer Discovery
    - swarm channels = everyone gets everyone in the channel
    - "from"+persistenceId = channel for updates from this persistance
        - everyone subscribed gets messages?
        - everyone keeps only connection with the host?
        - host keeps connections to everybody?

- канал peer discovery, где все сидят и анонсируют друг друга
    - если там уже такой есть, то выбрасывать с ошибкой?
- после анонсирования у всех есть каталог всех и все держат со всеми keep alive



1. Peer Discovery
    - канал, где все анонсируют друг друга (определён версией)
    - каждый держит каталог peerId (=RP это и есть носитель peerId)
        - всё это в remote/persistence сейчас, не в register.
        - а надо, чтобы было в registry.
    - 


- Subscribe over network
- Unsubscribe over network
- Send message over network
------------------------------------------------------------

Забыл всё, как я сделал.

- register persistence in DHT/DNS Swarm on startup
    - registry.register(P)
- deregister persistence in DHT/DNS Swarm
    - registry.unregister(P)
- get connection to the persistence = load by id?    
- channel:
    - prefix/id = I am not using it at all, it is only for load updates
    - * = main channel for persistence communication
- listeners:
    - register listener: (sender, payload)

- offline
    - send event = silent;
    - load
        - if the persistence is registered?
            - send...
                - return result.
                - ...timeout?
                    - deregister;
        - if not registered?
            - return `null`
                - learn to work with nulls everywhere;
                - ignore when loading artifacts for the world;
                - ignore on all mutates;
    - end.











------------------------------------------------------------

# Multiplayer and hosted universes
+ create two persistences
+ store 'persistenceId' next to id
+ `mutate` across network
+ `renderer` across network
+ `observer` across network
- proper messaging across network
- handle offline
- move items between three worlds


# Reasonable Refactoring
- merge remote/network in one module
- reduce duplication in RemoteEvent, echo, registry, mutate local/remote
- rewrite command system for observer, so move commands are chained with artifacts they move, not with the observer itself.
    - also rewrite object/subject for start/stop moving

# SMALL THINGS TO PLAY WITH WHEN NOT ENOUGH CONCENTRATION
- another session of documentation
- even more refactor positions, coords, and vector stuff
- lua highlighting within markdown
- when sending `move` event with `delta`, direction is broken
- WW: `move_by{ distance=10, angle=45 }`


# MAKE IT PRETTY!
- Apple Developer certificate
- animate entering the artifact
- animate leaving the artifact
- animate holding the artifact
- background & text colour overrides
- beautiful sprites
- good naming

# Big Things I Don't Want To Do
- massive load across network -> subscribe on changes



# 3 YEAR PROJECT PLAN (2019–2021)

1.  [x] Universe basis                       2019 Q4 Nov +
2.  [x] Basic Written world                  2019 Q4 Dec +
3.  [x] Persistence                          2020 Q1 Jan +
4.  [>] Hosted universes and multiplayer     2020 Q1 Feb
5.  [>] Full events support.                 2020 Q1 Mar
6.  [ ] Make a reasonably interesting game   2020 Q2 Jun
7.  [ ] Spoken word / gods (commands)        2020 H2 Oct
8.  [ ] Integrated editor with text flow     2021 H1 May
9.  [ ] Advanced objects like images etc.    2021 H2 Sep
10. [ ] Advanced concepts like <health>      2021 H2 Oct

# 4. Multiplayer

+ Address space
+ Visiting other spaces
- Messaging library
- Expose world address
- Portals to travel between words

# 5. Full support for events
+ Events
    + introduce roles
    + on: timer
    + on: move 
    + on: push/push-target (both actors)
    + on: pickup/pickup-target
    + on: putdown/putdown-target
    + on: enter/leave for world
    + on: enter/leave for artifact
    + on: stop (=closures in spatial commands)
+ WW: travel in chairs <- learn how to put code into chairs, make bouncing chair
+ WW: supporting enter/leave events
- Redocument Written Word and make a separate technical chapter on events
- refactor spatial chains
    - support halt
    - support proper object/subject


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


# Add New Event Checklist
- create RemoteEvent structures
- create `mutate` entry point
- implement `local` mutations
- implement `remote` proxies
- add to `registry`
- add to `echo`
- extend `supportedEvents` in Written Word


----
* https://www.npmjs.com/package/bitboot