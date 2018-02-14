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
## Building the database

If the database hasn't been built already it will do so automatically.
The database file will also be located in the "secret" folder.
Currently this process is slow. There are 48000x1000 fields.

There is a script for creating smaller samples in the scripts folder.

Doing some benchmarks revealed that 100 rows took 4 minutes to build.
500 rows took 20 minutes. (20 Mb)
That suggests that building 48000 rows will take 32 hours. (xD).
We will work on improving this, but we can always share the database file among ourselves later.

Read the file ```sh makeSamples.sh ``` for the complete instructions.
```sh
cd scripts
bash makeSamples.sh
```


Your app should now be running on [localhost:5000](http://localhost:5000/).
