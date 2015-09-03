var chalk = require('chalk');
//required as needed in individual functions:

//require('prompt');
//require('fs');
//require('yargs')

//thus dependencies: npm install --save-dev prompt yargs chalk

function DeployThing() {
    this.deployArgs = {
    };
}

DeployThing.prototype.config = {
    file: "deploy.ftp.json"
};


DeployThing.prototype.display = function(){
    console.log(chalk.cyan("  host: ") + this.deployArgs.host);
    console.log(chalk.cyan("  path: ") + this.deployArgs.path);
    console.log(chalk.cyan("  user: ") + this.deployArgs.user);
    console.log(chalk.cyan("  password: ") + ((this.deployArgs.password) ? "**ommitted**" : "~blank~"));
};

DeployThing.prototype.prompt = function (cb){
    var self = this;
    var prompt = require('prompt');
    var promptSchema = {
        properties: {
            host: {
                message: 'Host (eg feelingsofwhite.com)',
                required: true
            },
            path: {
                message: 'Path. To deploy to; on host (eg /games/astrosmash)',
                required: true
            },
            user: {
                message: 'ftp username',
                required: true
            },
            password: {
                message: 'ftp password',
                required: true,
                hidden: true
            },
            save: {
                message: 'safe information to ' + this.config.file,
                type: 'boolean',
                required: true,
                default: false
            }
        }
    };

    prompt.start();
     
    // 
    // Get two properties from the user: email, password 
    // 

    prompt.get(promptSchema, function (err, result) {
         if (err) {
            console.log(chalk.red(err));
            if (cb) {cb(err);} else if (err) {throw err;}
        } else {
            self.set(result);
            if (result.save) {
                self.writeToConfig(cb);
            } else {
                if (cb) {cb(err);} else if (err) {throw err;}
            }
        }
    });
};

DeployThing.prototype.set = function (value) {
    if (value)
        this.deployArgs = {
            host: value.host,
            user: value.user,
            password: value.password,
            path: value.path
        };
    else
        this.deployArgs = {};
};

DeployThing.prototype.writeToConfig = function (cb) {
    var self = this;
    var fs = require('fs');
    fs.writeFile(this.config.file, JSON.stringify(this.deployArgs, null, "\t"), function(err) {
        if(err) {
            console.log(chalk.red(err));
        }
        else{
            console.log("config saved to " + self.config.file);
        }
        if (cb) {cb(err);} else if (err) {throw err;}
    });
};

DeployThing.prototype.readFromConfigOrPrompt = function (cb) {
    var self = this;
    var fs = require('fs');
    fs.exists(self.config.file, function(exists) {
        var mycb = function(err){
            if (!(err)) {
                if (!self.isValid())
                {
                    err = "ftp credentials not valid";
                    console.log(chalk.red(err));
                }
            }
            if (cb) {cb(err);} else if (err) {throw err;}
        };
        if (exists)
            self.readFromConfig(mycb);
        else 
            self.prompt(mycb);
    });
};

DeployThing.prototype.readFromConfig = function (cb) {
    var self = this;
    var fs = require('fs');
    fs.readFile(this.config.file, 'utf8', function (err, data) {
        if (err) {
            console.log(chalk.red(err));
        }
        else {
            self.deployArgs = JSON.parse(data);
            
            console.log("config read from " + self.config.file);
        }
        if (cb) {cb(err);} else if (err) {throw err;}
    });
};

DeployThing.prototype.isValid = function () {
    if (!(this.deployArgs.host))     { return false; }
    if (!(this.deployArgs.path))     { return false; }
    if (!(this.deployArgs.user))     { return false; }
    if (!(this.deployArgs.password)) { return false; }
    return true;
};

DeployThing.prototype.readFromCommandLine = function () {
    var argv = require('yargs').argv;
    this.set(argv);

    if (!(this.deployArgs.host))     { console.log(chalk.red("ERR") + ": missing --host xxx"    ); process.exit(1);}
    if (!(this.deployArgs.path))     { console.log(chalk.red("ERR") + ": missing --path xxx"    ); process.exit(1);}
    if (!(this.deployArgs.user))     { console.log(chalk.red("ERR") + ": missing --user xxx"    ); process.exit(1);}
    if (!(this.deployArgs.password)) { console.log(chalk.red("ERR") + ": missing --password xxx"); process.exit(1);}

};

// var deploy = new DeployThing();
// deploy.readFromConfigOrPrompt(function() {
//     deploy.display();
// });

module.exports = new DeployThing();