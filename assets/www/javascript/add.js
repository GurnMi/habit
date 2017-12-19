
	var db = null;
	var hiddenId = -1;
	function openDB(){
		db = window.openDatabase("habit", "1.0","습관만들기",1024*1024);
	}
	
	function createDB(){
		db.transaction(function(tr) {
			var createSql = /* "drop table habit" */
					"create table if not exists habit"
					+ "(id integer primary key autoincrement,"
					+ "name text,dday integer, amount integer, time integer,"
					+ "why text,startday date, sub text)"; 

			tr.executeSql(createSql);
		});
	}
	
	function insertDB(){
		var name = $("#name").val();
		var dday = $("#dday").val();
		var amount = $("#amount").val();
		var time = $("#time").val();
		var why = $("#why").val();
		var startday = $("#startday").val();
		var sub = $("#sub").val();
		
		
		db.transaction(function(tr) {
			var insertSQL = "insert into habit(name,dday,amount,time,why,startday,sub) values(?,?,?,?,?,?,?)";

			tr.executeSql(insertSQL, [name,dday,amount,time,why,startday,sub], function(tr, ts) {
				$("#status").html("insert success");
				selectDB();
			}, function(tr, err) {
				$("#status").html("insert error");
			});
		})
		
	}
	function selectDB() {
		$("#wordlist").empty();
		db.transaction(function(tr) {
			var selectSql = "select * from habit";
			console.log(tr);
			
			
			
			tr.executeSql(selectSql, [], function(tr, rs) {
				
				if(rs.rows.length == 0){
					$("#wordlist").append("<li>item이 없습니다</li>");
				}
				
				$("#status").html("select success");
				$(rs.rows).each(
					function(i, obj) {
						var name = "<span class='name'>" + obj.name	+ "</span>";
						var dday = "<span class='dday'>" + obj.dday+ "</span>";
						var amount = "<span class='amount'>" + obj.amount+ "</span>";
						var time = "<span class='time'>" + obj.time+ "</span>";
						var why = "<span class='why'>" + obj.why+ "</span>";
						var startday = "<span class='startday'>" + obj.startday+ "</span>";
						var sub = "<span class='sub'>" + obj.sub+ "</span>";
						var id = "<span class='hiddenId'>" + obj.id	+ "</span>";
						$("#wordlist").append(
								"<li>" +name + " : " +startday+ ""+ dday + amount + 
								"시간"+time+ why+startday +sub+id+"</li>");
					})
					$("#wordlist").listview("refresh");
			}, function(tr, err) {
				$("#status").html("select error");
			});
		});
		
	}

	function deleteDB() {
		db.transaction(function(tr) {
			var deleteSql = "delete from habit where id=?"

			tr.executeSql(deleteSql, [ hiddenId ], function(tr, rs) {
				selectDB();
				$("#status").text("delete success");
			}, function() {
				$("#status").text("delete error");
			});
		});
	}

	
	function updateDB() {
		db.transaction(function(tr) {
			var updateSql = "update word set kor=?, eng=? where id=?";
			var kor = $("#kor").val();
			var eng = $("#eng").val();

			tr.executeSql(updateSql, [ kor, eng, hiddenId ], function(tr, ts) {
				$("#status").html("update success");
				selectDB();
			}, function(tr, err) {
				console.log(err);
				$("#status").html("update error");
			});
		})
	}