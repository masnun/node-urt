## Urban Terror Server Monitor
Yet another CLI tool for monitoring UrT Servers

<a href="https://www.npmjs.com/package/urt"><img src="https://nodei.co/npm/urt.png?mini=true"></a>



### Why another tool?

This one uses the awesome "blessed" and "blessed-contrib" nodejs packages to build an interactive UI on the command line. See the screenshot. 

<img src="https://raw.githubusercontent.com/masnun/node-urt/master/screenshot.png" alt="screenshot" />

The list updates automatically at an interval you specify. 


### How to install it? 

You can install it using npm. If you don't have npm and node.js installed, please install before running the following command:

	npm install -g urt
	

### How to run it? 

The following command connects to `5.135.165.34:27001` and updates the data every 1 second (1000 msecs).

	urt 5.135.165.34:27001 1000
	
The format is:
	
	urt server:port interval
	
