# maplestory
A simple html5 adventure game finished in last winter holiday in my college life.


## Description
This is a demo of the cool 2d online game [MapleStory](http://mxd.sdo.com/web6/home/index.asp), and all the resources come from [MapleSimulator](http://www.maplesimulator.com/).

This game may be not so cool, there are also some bugs, especially in the loading scene, if the progress stay a long time, please refresh. If I have time, I will recontruct it.

## Installation 

### 1. Start the Back-End
1. From the root directory of the repository, `cd backend` to make sure you are under the backend directory.
2. `python3 ./manage.py runserver` to start the django serve. (Note: there might be some libaries need to be installed before start the server, you can refer to [`backend/README.md`](https://github.com/Amadeus-Assist/maplestorydapp/blob/master/backend/README.md) for more detail if you are in the Linux environment.)
### 2. Start the Front-End (Market)
1. From the root directory of the repository, `cd frontend/market` to make sure you are under the market directory.
2. `npm i` to install related packages.
2. `npm run serve` to start the market at `http://localhost:3000/`.

### 3. Front-End (Game)
1. From the root directory of the repository, `cd frontend` to make sure you are under the frontend directory.
2. `npm i` to install related packages.
3. `npm run build` to browserify the `main.js`
4. `npm run serve` to start the game at `http://127.0.0.1:8080/`.

Now, you can navigate to `http://127.0.0.1:8080/` to enjoy our game!


## How to Play
- **Dirction key:** move
- **S:** pick up
- **D:** jump
- **F, G, R, T:** skills
- **Ctrl, Shift:** HP and MP regen
- **2, 3, 4:** items, ability, equipment

## Screenshots
![image](https://github.com/liwenone/maplestory/blob/master/screenshots/maplestory1.jpg)

![image](https://github.com/liwenone/maplestory/blob/master/screenshots/maplestory2.jpg)
