(function($){
	brite.registerView("TodoView",{
		
		// create the view
		create: function(){
			return render("tmpl-TodoView");
		},
		
		init: function(){
			brite.display("TaskListView",this.$el.find(".taskListViewCtn"));
		},
		
		// postDisplay is great place get the references of the key dom elements
		// and store them in the view for faster access, as it is executed 
		// after the view is displayed (async)
		postDisplay: function(){
			//	Here we ref DOM elements by ID to follow todoMVC markups, 
			//  but in real application, should use class rather than ids 
			//  for better componentization.
			this.$toggleAll = this.$el.find("#toggle-all");
			this.$newTodo = this.$el.find("#new-todo");
			this.$todoCount = this.$el.find("#todo-count");
			this.$clearCompleted = this.$el.find("#clear-completed")
		},
		
		
		events: {
			"keyup; #new-todo": function(event){
				var view = this;
				var val = view.$newTodo.val();
				if (event.which === 13 && val){
					app.taskDao.create({title:val}).done(function(newTask){
						view.$newTodo.val("");
				  });
				}
			},
			
			"change; #toggle-all": function(event){
				var view = this;
				app.taskDao.batchUpdate({done:view.$toggleAll.prop("checked")});
			},
			
			"click; #clear-completed": function(event){
				app.taskDao.batchDelete({done:true});				
			},
			
			"COUNT_CHANGE": function(event,countInfo){
				var view = this;
				var left = countInfo.total - countInfo.doneCount;
				
				view.$todoCount.html("" + left + " item" + ((left > 1)?"s":"") + " left");
				if (countInfo.doneCount > 0){
					view.$clearCompleted.show().html("Clear completed (" + countInfo.doneCount + ")");
				}else{
					view.$clearCompleted.hide();
				}
			}
		},
		
		daoEvents: {
			// On every task dataChange, we get the total and done count, and trigger 
			// the data change.
			"dataChange; Task": function(event){
				var view = this;
				$.when(app.taskDao.count(),app.taskDao.count({done:true})).done(function(total,doneCount){
					view.$el.trigger("COUNT_CHANGE",{total:total,doneCount:doneCount});
				 });
			} 
		}
		
	});
})(jQuery);