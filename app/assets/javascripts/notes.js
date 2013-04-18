$(document).ready(function(){
	init();
});


var init = function(){

	var newNote = new NewNote();

	var createNote = new CreateNoteView({
		el: $('.note-creator'),
		model: newNote
	});


	// Rendering all notes
	$.ajax({
		url: '/notes',
		type: 'get',
		success: function(data){
			_.each(data, function(note){
				$('.notes').append("<li class='note'><span class='note-body'>" + note.body + "</span><span class='note-date'>" + note.created_at + "</span></li>")
			});
		}
	});
}


var NewNote = Backbone.Model.extend({
	url: '/notes',

	initialize: function(){
		var self = this;
		self.on('create', function(){
			$.ajax({
				url: self.url,
				type: 'post',
				data: self.attributes,
				success: function(data){
					$('.notes').append("<li class='note'><span class='note-body'>" + data.body + "</span><span class='note-date'>" + data.created_at + "</span></li>")
				},
				error: function(data){
					debugger
				}
			});
		})
	}
	// create: function(){

	// }
});

var CreateNoteView = Backbone.View.extend({
	events: {
		'blur .new-note-form': 'fieldBlur',
		'submit .new-note-form': 'create'
	},

	fieldBlur: function(e){
		this.model.set($(e.target).attr('name'), $(e.target).val())
	},

	create: function(e){
		e.preventDefault();
		this.model.trigger('create')
	}
});
