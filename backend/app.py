from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS

from backend.algorithms.fibonacci import fibonacci_recursive_trace, fibonacci_memo_trace, fibonacci_tab_trace
from backend.algorithms.knapsack import knapsack_recursive_trace, knapsack_memo_trace, knapsack_tab_trace
from backend.algorithms.lcs import lcs_recursive_trace, lcs_memo_trace, lcs_tab_trace

# APP AND WEBSOCKET CONFIG

app = Flask(__name__)
CORS(app, resources={r"/*" : {"origins" : "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")


# ALGORITHM MAPPING

ALGORITHM_MAPPING = {
    'fibonacci' : {
        'recursive' : fibonacci_recursive_trace,
        'memoization' : fibonacci_memo_trace,
        'tabulation' : fibonacci_tab_trace
    },
    
    'knapsack' : {
        'recursive' : knapsack_recursive_trace,
        'memoization' : knapsack_memo_trace,
        'tabulation' : knapsack_tab_trace
    },
    
    'lcs' : {
        'recursive' : lcs_recursive_trace,
        'memoization' : lcs_memo_trace,
        'tabulation' : lcs_tab_trace
    }
}

# Websocket Event Handlers

@socketio.on('connect')
def handle_connect():
    # Handles a new client connecting to the Websocket
    print('Client Connected')
    emit('status', {'message': 'Successful Connection to Backend'})
    
@socketio.on('disconnect')
def handle_disconnect():
    # Handles a client disconnecting from the Websocket
    print('Client disconnected')

@socketio.on('execute_algorithm')
def handle_execute_algorithm(data):
    '''
    Main event handler for running algorithms
    Receives parameters from client, runs the corresponding algorithm and streams 
    the trace back one step at a time.
    '''

    problem = data.get('problem')
    algorithm_type = data.get('algorithm')
    params = data.get('params')
    
    # Validate the request
    if not all([problem, algorithm_type, params]):
        emit('error', {'message' : 'Invalid request. Missing fields.'})
    
    # Find the correct function to call
    func = ALGORITHM_MAPPING.get(problem, {}).get(algorithm_type)
    
    if not func:
        emit('error', {'message' : f"Algorithm '{algorithm_type}' for problem '{problem}' not found."})
    
    try:
        # call the appropriate function with its parameters
        if problem == 'fibonacci':
            trace = func(params['n']) 
        elif problem == 'knapsack':
            trace = func(params['weights'], params['values'], params['capacity'])
        elif problem == 'lcs':
            trace = func(params['s1'], params['s2'])
        else:
             emit('error', {'message' : 'Unknown Problem type'})
             return

        # Stream the trace back step-by-step
        for step in trace:
            emit('trace_step', step)
        
        emit('execution_complete', {'message': 'Execution Complete'})
    
    except Exception as e:
        emit('error', {'message' :f'An error occured: {str(e)}'})


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
         
    
    
    

