#!/usr/bin/env python3
"""Start the exported site using Python's standard library."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import errno
import webbrowser

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
    }

def main():
    directory = Path(__file__).resolve().parent
    handler = partial(Handler, directory=str(directory))
    server = None
    for port in range(8000, 8011):
        try:
            server = ThreadingHTTPServer(('127.0.0.1', port), handler)
            break
        except OSError as error:
            if error.errno != errno.EADDRINUSE and getattr(error, 'winerror', None) != 10048:
                raise
    if server is None:
        raise SystemExit('Ports 8000-8010 are busy. Use another local HTTP server.')
    url = f'http://127.0.0.1:{server.server_port}/'
    print('Kuznia - Broken Ranks')
    print(url, flush=True)
    print('Leave this terminal open. Press Ctrl+C to stop.', flush=True)
    try:
        webbrowser.open(url)
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
