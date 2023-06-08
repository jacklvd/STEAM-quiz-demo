import requests

BASE = "http://127.0.0.1:5000/"

headers = {"Content-Type": "application/json"}

data = [{"question": "What is your favorite color?", "choices": ["Red", "Blue", "Green"], "type": "Hard", "correctAns": "Blue"}]

# for i in range(len(data)):
# response = requests.put(BASE + "question/" + str(5), headers=headers, json=data[0])
# print(response.json())

response = requests.get(BASE + 'question/5')
print(response.json())

# response = requests.patch(BASE + 'video/0', json={'views': 77})
# print(response.json())