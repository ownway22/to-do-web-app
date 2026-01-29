#!/usr/bin/env python3
"""
待辦事項網頁應用 - 開發伺服器
使用 Python 內建的 http.server 模組提供靜態檔案服務
"""

import http.server
import socketserver
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    """自訂處理器，設定正確的 MIME 類型和快取控制"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    extensions_map = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '': 'application/octet-stream',
    }
    
    def end_headers(self):
        # 開發模式：禁用快取
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


def main():
    """啟動開發伺服器"""
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 待辦事項網頁應用開發伺服器")
        print(f"📁 服務目錄：{DIRECTORY}")
        print(f"🌐 開啟瀏覽器訪問：http://localhost:{PORT}")
        print(f"⏹️  按 Ctrl+C 停止伺服器")
        print("-" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 伺服器已停止")
            sys.exit(0)


if __name__ == "__main__":
    main()
