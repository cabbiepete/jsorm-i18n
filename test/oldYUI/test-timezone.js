/*global JSORM, testFn */
testFn.testTimeZone = function(T) {
	var TZ = JSORM.TimeZone, zones, expectedVersion = "2009u", numZones = 402;
	// list of zones to test and test inputs and expected outputs
	// each key is the name of a zone to load and check
	// each value is an array of tests
	// each test is itself an array whose keys are: [message,expected_value,time]
	zones = {
				  "America/New_York":[["Midsummer 2004",'-14400:1:EDT',"2004,6,2,1,0,0"],["Midwinter 2004",'-18000:0:EST',"2004,1,2,1,0,0"],
									  ["End of DST 1995",'-14400:1:EDT',"1995,9,28,1,59,59"],["Begin STD 1995",'-18000:0:EST',"1995,9,28,2,0,0"]],
				  "Europe/London":[["Midsummer 2004",'3600:1:BST',"2004,6,2,1,0,0"],["Midwinter 2004",'0:0:GMT',"2004,1,2,1,0,0"],
								   ["End of DST 1995",'3600:1:BST',"1995,9,21,1,59,59"],["Begin STD 1995",'0:0:GMT',"1995,9,21,2,0,0"]],
				  "Asia/Jerusalem":[["Midsummer 2004",'10800:1:IDT',"2004,6,2,1,0,0"],["Midwinter 2004",'7200:0:IST',"2004,1,2,1,0,0"],
									["End of STD 2000",'7200:0:IST',"2000,3,13,1,59,59"],["Begin DST 2000",'10800:1:IDT',"2000,3,13,2,0,0"]],
				  "Asia/Tokyo":[["Midsummer 2004",'32400:0:JST',"2004,6,2,1,0,0"],["Midwinter 2004",'32400:0:JST',"2004,1,2,1,0,0"]]
				};
	
	
	TZ.basepath =  '../';
	TZ.path = 'build/zoneinfo/';
	
	return new T.testCase({
		/*
		 * Functions to test timezone functionality.
		 * These are the tests we want to perform:
		 * 1) Test known transition times in a few timezones.
		 * 2) Test known sample times
		 * 3) Test expected version
		 * 4) Test list of zones length
		 * 5) Test expected zones are there
		 */
		testVersion : function() {
			var test = this;
			TZ.getVersion({callback: function(success,version,options) {
				test.resume(function(){
					T.equal(expectedVersion,version,"Version mismatch");					
				});
			}});
			test.wait(3000);
		},
		testNumZones : function() {
			var test = this;
			TZ.getZoneList({callback: function(success,list,options) {
				test.resume(function(){
					var count=0, i;
					for (i in list.zones) {
						if (list.zones.hasOwnProperty(i) && typeof(list.zones.i) !== "function") {
							count++;							
						}
					}
					T.equal(numZones,count,"Wrong number of zones");					
				});
			}});
			this.wait(3000);
		},
		testZoneEntries : function() {
			var test = this, tzZones = {}, list = [], i, count = 0, cb;
			for (i in zones) {
				if (zones.hasOwnProperty(i) && typeof(zones[i]) !== "function") {
					list.push(i);
				}
			}
			cb = function(success,zone,options) {
				tzZones[zone.name] = zone;
				count++;
				if (count === list.length) {
					test.resume(function() {
						var i;
						for (i in zones) {
							if (zones.hasOwnProperty(i) && typeof(zones[i]) !== "function") {
								T.notNull(tzZones[i],"Check zone in list");
							}
						}							
					});
				}
			};
			for (i=0;i<list.length;i++) {
				TZ.getZone({name: list[i],callback: cb});		
			}
			this.wait(3000);
		},
		testTimes : function() {
			var test = this, tzZones = {}, list = [], i, count = 0, cb;
			for (i in zones) {
				if (zones.hasOwnProperty(i) && typeof(zones[i]) !== "function") {
					list.push(i);
				}
			}
			cb = function(success,zone,options) {
				tzZones[zone.getName()] = zone;
				count++;
				if (count === list.length) {
					test.resume(function() {
						var tz,info,infoStr,d,message,expect, i, j;
						// check several during midsummer and midwinter
						// New York
						for (i in zones) {
							if (zones.hasOwnProperty(i) && typeof(zones[i]) !== "function") {
								tz = tzZones[i];
								for (j in zones[i]) {
									if (zones[i].hasOwnProperty(j) && typeof(zones[i][j] !== "function")) {
										message = zones[i][j][0];
										expect = zones[i][j][1];
										d = zones[i][j][2].split(',');
										info = tz.getZoneInfo(parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10),parseInt(d[4],10),parseInt(d[5],10));
										infoStr = info.offset+':'+info.isDst+':'+info.abbr;
										T.equal(expect,infoStr,message+":"+i);											
									}
								}
							}
						}							
					});
				}
			};
			for (i=0;i<list.length;i++) {
				TZ.getZone({name: list[i],callback: cb});					
				
			}
			this.wait(3000);
		}
	});
};
