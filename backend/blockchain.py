import hashlib
import json
from datetime import datetime


class Block:
    def __init__(self, index, data, previous_hash):
        self.index = index
        self.timestamp = datetime.utcnow().isoformat()
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self._compute_hash()

    def _compute_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()


class Blockchain:
    def __init__(self):
        self.chain = [self._genesis()]

    def _genesis(self):
        return Block(0, {"message": "Genesis Block"}, "0")

    def add_block(self, data):
        block = Block(len(self.chain), data, self.chain[-1].hash)
        self.chain.append(block)
        return block
