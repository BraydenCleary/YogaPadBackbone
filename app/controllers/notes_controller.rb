class NotesController < ApplicationController
	respond_to :json

	def index
		@notes = Note.all
		respond_with @notes
	end

	def create
		@note = Note.new(body: params['body'])
		@note.save
		respond_with @note
	end

end
