
    var schedule = ( function(){
		var db;
		var log = document.getElementById('db-log');
		if(window.openDatabase){
			db = openDatabase("Task", "1.0", " Scheduler", 200000);
                showRecords();
		}
		document.getElementById('db-results').addEventListener('click', function(e) { e.preventDefault(); }, false);
               function onError(tx, error) {
                log.innerHTML = '<p class="error">Error: ' + error.message + '</p>';
              }
		function showRecords() {
                document.getElementById('db-results').innerHTML = '';
                db.transaction(function(tx) {
                  tx.executeSql("SELECT * FROM Test", [], function(tx, result) {
                    for (var i = 0, item = null; i < result.rows.length; i++) {
                      item = result.rows.item(i);
                      document.getElementById('db-results').innerHTML += 
                          '<li><u><span contenteditable="true" onkeyup="schedule.updateRecord('+item['id']+', this)">'+
                          item['text'] + '</span> <a href="#" onclick="schedule.deleteRecord('+item['id']+')">[Delete]</a></u></li>';
                    }
                  });
                });
	}
	function createTable() {
                db.transaction(function(tx) {
                  tx.executeSql("CREATE TABLE Test (id REAL UNIQUE, text TEXT)", [],
                      function(tx) {  log.innerHTML = '<h4>New Schedule created!</h4>' },
                      onError);
                });
              }
               function newRecord() {
                var num = Math.round(Math.random() * 10000); // random data
                db.transaction(function(tx) {
                  tx.executeSql("INSERT INTO Test (id, text) VALUES (?, ?)", [num, document.querySelector('#task').value],
                      function(tx, result) {
                        log.innerHTML = '';
                        showRecords();
                      }, 
                      onError);
                });
              } 
              function updateRecord(id, textEl) {
                db.transaction(function(tx) {
                  tx.executeSql("UPDATE Test SET text = ? WHERE id = ?", [textEl.innerHTML, id], null, onError);
                });
              } 
              function deleteRecord(id) {
                db.transaction(function(tx) {
                  tx.executeSql("DELETE FROM Test WHERE id=?", [id],
                      function(tx, result) { showRecords() }, 
                      onError);
                });
              } 
              function dropTable() {
                db.transaction(function(tx) {
                  tx.executeSql("DROP TABLE Test", [],
                      function(tx) { 
showRecords();
log.innerHTML = '<h4>Schedule Deleted !</h4>' }, 
                      onError);
                });
              }              
              return {
                newRecord: newRecord,
                createTable: createTable,
                updateRecord: updateRecord,
                deleteRecord: deleteRecord,
                dropTable: dropTable
              }
            })();
			