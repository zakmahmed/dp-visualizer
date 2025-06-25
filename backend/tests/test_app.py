import unittest
from backend.app import app, socketio

class TestSocketIOAPP(unittest.TestCase):
    
    '''Testing main application and event handling'''
    
    def setUp(self):
        # Setting up test client
        app.config['TESTING'] = True
        self.client = app.test_client()
        self.socketio_client = socketio.test_client(app)

    
    def tearDown(self):
        if self.socketio_client.is_connected():
            self.socketio_client.disconnect()
    
    
    def test_connect_and_disconnect(self):
        self.assertTrue(self.socketio_client.is_connected())
        
        # Check if initial status message was received
        received = self.socketio_client.get_received()
        self.assertEqual(len(received), 1)
        self.assertEqual(received[0]['name'], 'status')
        self.assertEqual(received[0]['args'][0]['message'], 'Successful Connection to Backend')

        
        self.socketio_client.disconnect()
        self.assertFalse(self.socketio_client.is_connected())
        
    
    def test_execute_fibonacci(self):
        request_data = {
            'problem' : 'fibonacci',
            'algorithm' : 'tabulation',
            'params' : {'n' : 5}
        }
        self.socketio_client.emit('execute_algorithm', request_data)
        
        received_events = self.socketio_client.get_received()
        
        # Check for a group of traceback steps
        self.assertGreater(len(received_events), 1)
        self.assertEqual(received_events[1]['name'], 'trace_step')
        
        self.assertEqual(received_events[-1]['name'], 'execution_complete')
        
        # Check final result
        final_step = received_events[-2]['args'][0]
        self.assertEqual(final_step['result'], 5)
        
    
    def test_execute_knapsack(self):
        request_data = {
            'problem' : 'knapsack',
            'algorithm' : 'tabulation',
            'params' : {
                'weights' : [10, 20, 30],
                'values' : [60, 100, 120],
                'capacity' : 50
                }
        }
        self.socketio_client.emit('execute_algorithm', request_data)
        
        received_events = self.socketio_client.get_received()
        
        # Check for a group of traceback steps
        self.assertGreater(len(received_events), 1)
        self.assertEqual(received_events[1]['name'], 'trace_step')
        self.assertEqual(received_events[-1]['name'], 'execution_complete')
        
        # Check final result
        final_step = received_events[-2]['args'][0]
        self.assertEqual(final_step['result'], 220)
        
    
    def test_execute_lcs(self):
        request_data = {
            'problem' : 'lcs',
            'algorithm' : 'tabulation',
            'params' : {
                's1' : "AGGTAB",
                's2' : "GXTXAYB",
                }
        }
        self.socketio_client.emit('execute_algorithm', request_data)
        
        received_events = self.socketio_client.get_received()
        
        # Check for a group of traceback steps
        self.assertGreater(len(received_events), 1)
        self.assertEqual(received_events[1]['name'], 'trace_step')
        self.assertEqual(received_events[-1]['name'], 'execution_complete')
        
        # Check final result
        final_step = received_events[-2]['args'][0]
        self.assertEqual(final_step['result_length'], 4)
        self.assertEqual(final_step['result'], "GTAB")
    
    
    