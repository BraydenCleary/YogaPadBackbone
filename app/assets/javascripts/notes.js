$(document).ready(function(){
	init();
});


var init = function(){

	var newNote = new NewNote();

	var createNote = new CreateNoteView({
		el: $('.note-creator'),
		model: newNote
	});

	var notesCollection = new Backbone.Collection({});

	var notesview = new NotesView({
		el: $('.notes-display'),
		collection: notesCollection
	});


	// Rendering all notes
	$.ajax({
		url: '/notes',
		type: 'get',
		success: function(data){
			// _.each(data, function(note){
			// 	$('.notes').append("<li class='note'><span class='note-body'>" + note.body + "</span><span class='note-date'>" + note.created_at + "</span></li>")
			// });
			notesCollection.reset(data)
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
					self.doneCreating();
				}
			});
		})
	},

	doneCreating: function(){
		this.clear();
		this.trigger('created');
	}
});

var CreateNoteView = Backbone.View.extend({
	events: {
		'blur .new-note-form': 'fieldBlur',
		'submit .new-note-form': 'create'
	},

	initialize: function(){
		var self=this;
		this.model.on('created', function(){
			self.reset();
		})
	},

	fieldBlur: function(e){
		this.model.set($(e.target).attr('name'), $(e.target).val())
	},

	create: function(e){
		e.preventDefault();
		this.model.trigger('create')
	},

	reset: function(){
		this.$el.find("[name='body']").val('');
	}
});

var NotesView = Backbone.View.extend({
	notesListTemplate: _.template("<ul class='notes'><%= notesListHTML %></ul>"),

	noteTemplate: _.template("<li class='note'><span class='note-body'><%- body %></span><span class='note-date'><%- created_at %></span></li>"),

	initialize: function(){
		this.collection.on('reset', this.render.bind(this))
	},

	render: function(){
		var self = this;
		self.$el.html('');
		var notesListHTML = _.map(this.collection.models, function(model){
			return self.noteTemplate(model.attributes);
		}).join('');
		self.$el.append(self.notesListTemplate({notesListHTML: notesListHTML}))
	}
})
