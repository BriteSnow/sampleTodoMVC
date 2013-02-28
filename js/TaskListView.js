(function($){
	brite.registerView("TaskListView",{
		
		// create the view
		create: function(){
			return app.taskDao.list().pipe(function(tasks){
				 return "<div class='TaskListView'>" + render("tmpl-TaskListView-todo-list",{tasks:tasks}) + "</div>";
			});
		},
		
		events: {
			// handle the todo destroy UI event
			"click; .destroy": function(event){
				var entityRef = $(event.currentTarget).bEntity("Task");
				app.taskDao.delete(entityRef.id);
			}, 
			
			// handle the todo done state UI event
			"change; input[type='checkbox']": function(event){
				var $check = $(event.currentTarget);
				var entityRef = $check.bEntity("Task");
				app.taskDao.update({id:entityRef.id,
					                  done:$check.prop("checked")}); 
			}, 
			
			// handle the todo edit UI event
			"dblclick; li": function(event){
				var $li = $(event.currentTarget);
				var $label = $li.find("label");
				var $input = $li.find("input");
				$input.val($label.text());
				$li.removeClass("view").addClass("editing");
				$input.focus();
			}, 
			
			// handle the key "COMMIT" or "CANCEL" UI event (enter or esc)
			"keyup; li input": function(event){
				var $input = $(event.currentTarget);
				
				// if press ENTER, we update the Task
				if (event.which == 13){
					var entityRef = $input.bEntity("Task");
					app.taskDao.update({id: entityRef.id,
						                  title: $input.val()});
				}
				// if escape, we cancel (just trigger a blur on the input)
				else if (event.which == 27){
					$input.trigger("blur");
				}
			}, 
			
			// handle the cancel UI event
			"blur; li input": function(event){
				var $input = $(event.currentTarget).val("");
				var $li = $input.closest("li");
				$li.removeClass("editing").addClass("view");
			}
		},
		
		daoEvents: {
			"dataChange; Task; update" : function(event){
				refreshTodoList.call(this);
			},
						
			"dataChange; Task; delete" : function(event){
				refreshTodoList.call(this);
			},
			
			"dataChange; Task; create" : function(event){
				refreshTodoList.call(this);
			},
			
			"dataChange; Task; batchDelete" : function(event){
				refreshTodoList.call(this);
			},
			
			"dataChange; Task; batchUpdate" : function(event){
				refreshTodoList.call(this);
			}
			
			// Note: Since we are calling the same method for all dataChange events, 
			//       this could have been implemented by a single daoBinding as 
			//"dataChange": function(event){ refreshTodoList.call(this); }	
		}
		
	});
	
	// private view methods to refresh the list
	function refreshTodoList(){
		var view = this;
		app.taskDao.list().pipe(function(tasks){
			var todoListHTML = render("tmpl-TaskListView-todo-list",{tasks:tasks});
			view.$el.html(todoListHTML);
		});	
	}
	
	
})(jQuery);