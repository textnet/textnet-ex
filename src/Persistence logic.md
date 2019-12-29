

1. Maintain persistence on one machine
2. Maintain persistence over machines




1. tore/fetch to persistence from other places
------
- store to persistence when something coming over network
- fetch from persistence when something asked over network

Who/how should be asking?

Is there any kind of local cache?
Or cache is over persistence?

Does persistence store shit from other places?
Is persistence its own cache?

Persistence:

    - Account(...) <- local!
        - Avatars
        - Artifacts
    - Account(...) <- cache!

If something is asked to be loaded from non-local account, then `fetch` happens and result is `store`-d. 


2. get/set to persistence in the current flow
------
- 1) retrieve account
- 2) is it a local account? 
    -> return structure from local persistence 
    -> build an object
- 3) is it a new unknown peer?
    -> setup a new peer
- 4) is it a data we never asked from the peer?
    -> `fetch` and wait until it is delivered
- 5) do we have data in our cache?
    -> return data?


3. when persistence is changed, should we communicate it around?
-------
- 1) is it local persistence?
    -> no, just save
- 2) we are trying to update persistence which is not local
    -> find the peer


4. when peer goes offline
------
- universe/storage: remove artifact which is an avatar from that peer from the world
- universe/storage: if there is a player online, move her into her own world adding a visit.

5. when peer goes online
------
- do nothing
- (peers will try to push their avatars themselves)

6. when local goes online
------
- network: push my avatar into peers which are theirs
- on fail -> universe/storage: put my avatar into its own world
- on success -> universe: set up from network

7. when local goes offline
------
- if avatar is not local -> 
    -> network: signal going offline
    -> universe/storage: do nothing
- if avatar is local -> universe/storage: remove from the world

Main question is how to operate in cases:

* local player in remote world
    - there is code which is owned locally
    - observer is remote
    - local universe: 
        - stores code etc. 
        - if change happens, event is sent to (remote) observer.
        - (local) observer receives events from (remote) observer and changes its state.
            - state is pushed???
    - remote universe:
        - (remote observer) gets remote universe events
            - 

* remote player in local world
    - observer is local
    - code is remote




1. Who runs the code?
2. Who stores the definitive state?
3. What is happening locally?


1. Remote player on the local machine.
--------------------------------------

Давайте попробуем без кода пока.

Артефакт = данные
Аватар = поведение артефакта
Наблюдатель = выполняемый код, подписан на события

У одного артефакта может быть только один аватар.

1. PLAYER = локальный игрок.
   Actor, который связан с этим аватаром через артефакт, получает команды с клавиатуры.

2. LOCAL = локально созданный аватар.
   Этот автара будет получать команды из кода, который выполняется на этом компьютере.

3. PROXY = кто-то, существующий на другом сервере.
   Мы не знаем, кто это. Но мы знаем, что нам не нужно выполнять код.
   Мы знаем, что нам будут приходить действия этого аватара.
   Мы также знаем, что нам нужно отсылать события на другой сервер, там
   работает наблюдатель, который исполняет код.

Если у объекта есть PROXY аватар, то наблюдатель выполняет специальную функцию.
Он пересылает события дальше?

Как работают подписки? Код, выполняемый локально, подписывается на события через своего наблюдателя.
Наблюдатель получает события от того мира, в котором он находится.
Когда аватар перемещается в какой-то другой мир, что происходит?

Прежде всего, насколько persistent entity я хочу сделать аватара?

- Аватар игрока persists
- Когда код компилируется, становится ли он persistent avatar? 
  Будем ли мы сохранять его состояние, и что это значит?

  Когда мы убираем аватара из мира?

  Как это сейчас сделано?

  Когда мы компилируем код, то мы решаем сделать аватара.

А если так.

У мира есть владелец, по цепочке мы находим аккаунт.
Когда мы изымаем артефакт из мира, мы его передаём в другой аккаунт.

Без кода всё это выглядит «просто».

Все артефакты принадлежат тому миру, где они находятся.
Кроме артефактов, у которых есть прокси-аватары.
Прокси-аватар содержит ссылку на account, к которому он принадлежит.
Прокси-аватар получает команды из сети и меняет своё положение.

- - - - - - -

Игрок, находящийся на чужом сервере, что происходит с ним?
У него есть объекты world, etc.


- - - - - - - - -
Мы загружаем мир:
    - получаем account id (from world id)
    - загружаем world, world.owner, world.artifacts
    - вставляем туда нашего локального игрока (отсылаем назад)
    - отсылаем все события в удалённый мир
    - когда приходят события из удалённого мира, меняем наш мир
    - наблюдатели смотрят только на события, которые приходят из мира
    - ...
    - когда мы выходим, то выгружаем локального игрока из мира

- - - - - - - - -
Что получается с кодом?
Рассмотрим ситуацию: игроки А и Б находятся в мире В.
Текст мира В содержит код.
Где этот код исполняется? — на компьютере В (иначе конфликт А и Б).

Когда хотя бы один из игроков входит в мир В, он должен создавать наблюдателя в этом мире?

Что происходит в мире В, когда там никого нет?
Я не хочу создавать код, который всё время выполняется.

Источник должен быть один.
Это значит, что дело не в том, сколько игроков, а в том, сколько артефактов.

1. Только если внутри код, он становится выполняемым.
2. Он выполняется всегда вне зависимости от того, есть ли там люди
3. При перезапуске системы код становится выполняемым.

Это значит, что когда мы запускаемся, нам нужно запустить все артефакты.
- - - - - - - - - - - -
Мы запускаемся:

- запустить все артефакты
    - для всех артефактов, которые находятся в чужих мирах, вставить из туда
- загрузить мир
    - если мир офлайн, загрузить свой собственный















