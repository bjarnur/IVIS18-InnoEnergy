# IVIS18-InnoEnergy
A group project in the course Information Visualization, where the goal is to provide useful visualization of data for the company InnoEnergy

## Installing

Make sure you have [Node.js](http://nodejs.org/) installed on your computer.

You can verify that you do by typing in the terminal:

```sh
npm --version
```

You should see something similar to

```sh
5.6.0
```

## Running

Read the rest of this document before you start pasting code.

```sh
git clone git@github.com:elBjarnacho/IVIS18-InnoEnergy.git # if you haven't got the project on disk
cd IVIS18-InnoEnergy # navigate to the folder that was just created
npm install # this installs dependencies
# !IMPORTANT Now you need to move the data file to the folder named 'secret'
npm start # launches the webserver, it's reachable in the browser as long as the process is alive.
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Building the database

NB: If you have trouble getting started with building the database, you can download a working version
from our google drive repository. You put it in the secret folder and start the server with ```sh npm start ```

Make sure you have Python 3 installed on your computer.

You can verify that you do by typing in the terminal:

```sh
python3 --version
```

You should see something similar to

```sh
Python 3.5.2
```

Note that if you have other versions of python installed, you may have to google some answers ahead.
Now you will have to install the dependencies for our project, found in ```lib/db/parseConsumption.py```
Use ```sh pip ``` to install dependencies. If you have multiple versions of python use ```sh pip3 ```

When building the database you need to make sure that you have placed the relavant
files in the "secret" folder, i.e. one csv file for consumption data(el_07_07_2017.csv) and one csv
file for additional information on buildings (use the name building_info.csv when
saving the file).

*NOTE*: Make sure you download the latest version of the building_info file to ensure
the correct behavior. You can make sure that you have the latest version by checking
that the columns longitude and latitude exist. If you are downloading this file for the
first time, delete the file db.sqlite from the secret folder before running npm start.
If you experience some issues, try shutting node off and running it once more, sometimes we
need to start it twice to generate all tables (we should probably look into this :) ).

If the database hasn't been built already it will do so automatically.
The database file will also be located in the "secret" folder.
Currently this process is should take about 10-15 minutes. There are 48000x1000 fields.

If you have trouble getting started with building the database, you can download a working version
from our google drive repository.

You can rebuild the database with the command:

```sh
npm test
```


## Visualization with backend

```sh
npm start
```
Go to [localhost:5000/demo](http://localhost:5000/demo),type ID and you'll see the
consumption over time.
