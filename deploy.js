var prompt = require('prompt');

function promptFor(){
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
          required: true
        }
      }
    };
     
    // 
    // Start the prompt 
    // 
    prompt.start();
     
    // 
    // Get two properties from the user: email, password 
    // 
    prompt.get(promptSchema, function (err, result) {
      // 
      // Log the results. 
      // 
      console.log('Command-line input received:');
      console.log('  host: ' + result.host);
      console.log('  path: ' + result.path);
      console.log('  user: ' + result.user);
      console.log('  password: ' + result.password);
    });
    return
};

promptFor()