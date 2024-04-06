import http.server
import socketserver
import json
import check

PORT = 3001

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/AIQuiz':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            json_data = json.loads(post_data)

            # Catch the image_data from the JSON payload
            if 'image_data' in json_data:
                image_data = json_data['image_data']
                prediction = check.predict_label(image_data)

                # Return a response
                api_response = {'message': 'Received the image_data successfully', 'prediction': prediction}
                response_json = json.dumps(api_response)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(response_json.encode())
            else:
                # Invalid request, missing image_data parameter
                api_response = {'error': 'Missing image_data parameter'}
                response_json = json.dumps(api_response)

                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(response_json.encode())

        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print("Server started on port", PORT)
    httpd.serve_forever()





