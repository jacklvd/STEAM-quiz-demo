from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
CORS(app)
cors = CORS(app, resources={r"/question/*": {"origins": "http://127.0.0.1:5173"}})


class QuestionModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(100), nullable=True)
    type = db.Column(db.String(100), nullable=True)
    correctAns = db.Column(db.String(100), nullable=True)
    choices = db.relationship('ChoiceModel', backref='question', lazy=True)

    def __repr__(self):
        return f"question={self.question}, type={self.type}, choices={self.choices}, correctAns={self.correctAns}"


class ChoiceModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    question_id = db.Column(db.Integer, db.ForeignKey('question_model.id'), nullable=False)

    def __repr__(self):
        return f"name: {self.name}"
    

with app.app_context():
    db.create_all()


question_put_args = reqparse.RequestParser()
question_put_args.add_argument("question", type=str, help="Content of the question")
question_put_args.add_argument("choices", type=str, action='append', help="Choices of the question")
question_put_args.add_argument("type", type=str, help="Type of the question")
question_put_args.add_argument("correctAns", type=str, help="Correct answer of the question")


resource_fields = {
    'id': fields.Integer,
    'question': fields.String,
    'choices': fields.List(fields.String),
    'type': fields.String,
    'correctAns': fields.String
}


class Question(Resource):
    @marshal_with(resource_fields)
    def get(self, question_id=None):
        if question_id is None:
            questions = QuestionModel.query.all()
            for i in range(len(questions)):
                questions[i] = {
                    'id': questions[i].id,
                    'question': questions[i].question,
                    'choices': [choice.name for choice in questions[i].choices],
                    'type': questions[i].type,
                    'correctAns': questions[i].correctAns
                }
            return questions
        else:
            question = QuestionModel.query.get(question_id)
            if not question:
                abort(404, message="Question not found")
            return question
    
    @marshal_with(resource_fields)
    def post(self):
        args = question_put_args.parse_args()
        question = QuestionModel(question=args['question'], type=args['type'], correctAns=args['correctAns'])
        for choice in args['choices']:
            question.choices.append(ChoiceModel(name=choice))
        db.session.add(question)
        db.session.commit()

        question_dict = {
            'id': question.id,
            'question': question.question,
            'choices': [choice.name for choice in question.choices],
            'type': question.type,
            'correctAns': question.correctAns
        }
        return question_dict, 201
    

    def delete(self, question_id):
        question = QuestionModel.query.filter_by(id=question_id).first()
        if not question:
            abort(404, message="Question not found")

        ChoiceModel.query.filter_by(question_id=question_id).delete()
    
        db.session.delete(question)
        db.session.commit()
        return '', 204
    
@app.route('/api/quiz')
def get_quiz():
    quiz_data = {
        'totalQuestions': len(QuestionModel.query.all()),
        'perQuestionScore': 1,
        'questions': []
    }

    questions = QuestionModel.query.all()
    for question in questions:
        choices = [choice.name for choice in question.choices]
        correct_answer = question.correctAns
        quiz_data['questions'].append({
            'question': question.question,
            'choices': choices,
            'type': question.type,
            'correctAnswer': correct_answer
        })

    return jsonify(quiz_data)


api.add_resource(Question, "/question", "/question/<int:question_id>")

if __name__ == "__main__":
    app.run(debug=True)
