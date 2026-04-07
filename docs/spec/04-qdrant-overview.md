# Qdrant Integration Overview

> **Purpose**: High-level overview of Qdrant integration with FastEmbed, covering architecture, deployment patterns, and getting started guide.
> 
> **Status**: v0.1.0 - Initial overview
> 
> **Dependencies**: See [Qdrant Dependency Reference](./05-dependencies.md)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture](#2-architecture)
3. [Deployment Patterns](#3-deployment-patterns)
4. [Getting Started](#4-getting-started)
5. [Use Cases](#5-use-cases)
6. [Performance Considerations](#6-performance-considerations)
7. [Troubleshooting](#7-troubleshooting)
8. [Best Practices](#8-best-practices)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### What is Qdrant?

Qdrant is a **vector similarity search engine** optimized for machine learning applications. It provides:

- **High-performance vector search** using HNSW (Hierarchical Navigable Small World) index
- **Multi-modal support** for text, image, and sparse vectors
- **Hybrid search** combining dense and sparse vectors
- **Reranking capabilities** for improved search quality
- **REST API** for easy integration
- **Docker support** for easy deployment

### Why Qdrant + FastEmbed?

The combination of Qdrant and FastEmbed provides:

- **Fast embeddings**: FastEmbed offers GPU-accelerated inference with minimal dependencies
- **Lightweight**: FastEmbed can run entirely in Python without external dependencies
- **Multi-model support**: Access to 25+ pre-trained embedding models
- **Hot-swappable models**: Change embedding models without retraining
- **Production-ready**: Optimized for production workloads

### Key Features

- **Vector similarity search**: Find similar vectors using cosine, dot, or euclidean distance
- **Multi-modal search**: Combine text and image vectors in the same collection
- **Sparse vectors**: Support for BM25 and other sparse embedding methods
- **Reranking**: Improve search results with cross-encoder reranking
- **Hybrid search**: Combine dense and sparse vectors for better results
- **Filtering**: Filter results by metadata
- **Scalability**: Handle millions of vectors efficiently

---

## 2. Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Python App  │  │ REST API    │  │ Streaming Service   │  │
│  │ FastAPI     │  │ (Flask/Fast)│  │ (WebSockets)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   FastEmbed Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ TextEmbedding│  │ImageEmbedding│  │ SparseTextEmbedding│  │
│  │ 384-1024dim │  │ 2048-768dim │  │ BM25/SPLADE         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ CrossEncoder │  │Reranking   │  │ Quantization         │  │
│  │ Reranking   │  │             │  │                       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Qdrant Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Vector Space │  │Metadata     │  │Persistence           │  │
│  │ Dense (384+)│  │Index        │  │(RocksDB/SQLite)     │  │
│  │ Sparse (BM25)│  │Filtering   │  │                      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Storage Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Local File  │  │S3/MinIO     │  │PostgreSQL            │  │
│  │ System      │  │             │  │(Metadata)            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Application Layer** | Business logic, API endpoints, user interface |
| **FastEmbed Layer** | Model loading, embedding generation, reranking |
| **Qdrant Layer** | Vector storage, similarity search, filtering |
| **Storage Layer** | Persistent storage for vectors and metadata |

### Data Flow

```
User Query → Application Layer → FastEmbed (embed query) → 
Qdrant (vector search) → Results → FastEmbed (rerank) → 
Application Layer → User Response
```

### Memory Model

- **Vectors**: Stored in Qdrant as binary vectors (float32)
- **Metadata**: Stored as JSON payloads in Qdrant
- **Models**: Loaded into memory by FastEmbed (CPU or GPU)
- **Index**: HNSW index built on vectors for fast search

---

## 3. Deployment Patterns

### Pattern 1: Standalone Deployment

```bash
# Docker Compose for standalone deployment
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      - QDRANT_MEMORY_MAPPED_INDEX=false

  fastapi-app:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - qdrant
    environment:
      - QDRANT_URL=http://qdrant:6333

volumes:
  qdrant_storage:
```

### Pattern 2: Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qdrant
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qdrant
  template:
    spec:
      containers:
      - name: qdrant
        image: qdrant/qdrant:latest
        ports:
        - containerPort: 6333
        resources:
          requests:
            memory: "2Gi"
            cpu: "500m"
          limits:
            memory: "4Gi"
            cpu: "1000m"
```

### Pattern 3: Cloud-Native Deployment

```python
# AWS Lambda function
import json
import boto3
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

def lambda_handler(event, context):
    client = QdrantClient(url=os.environ['QDRANT_URL'])
    model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Query
    query_embedding, _ = model.embed([event['query']])
    results = client.query("collection", query=query_embedding[0], limit=10)
    
    return {"statusCode": 200, "body": json.dumps(results)}
```

### Pattern 4: Edge Deployment

```bash
# Run Qdrant on edge device
docker run -d \
  --gpus all \
  -p 6333:6333 \
  -v /data/qdrant:/qdrant/storage \
  qdrant/qdrant:latest \
  --model sentence-transformers/all-MiniLM-L6-v2 \
  --quantize float16
```

---

## 4. Getting Started

### Step 1: Installation

```bash
# Install dependencies
pip install fastembed qdrant-client

# Or using conda
conda install -c conda-forge fastembed
pip install qdrant-client
```

### Step 2: Basic Setup

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

# Initialize Qdrant client
client = QdrantClient(url="http://localhost:6333")

# Create collection
client.create_collection(
    collection_name="documents",
    vectors_config={
        "text": models.VectorParams(
            size=384,
            distance=models.Distance.COSINE
        )
    }
)

# Initialize FastEmbed model
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
```

### Step 3: Index Data

```python
# Prepare documents
documents = [
    {"id": 1, "text": "Machine learning is a subset of artificial intelligence", "metadata": {"category": "AI"}},
    {"id": 2, "text": "Deep learning uses neural networks with multiple layers", "metadata": {"category": "AI"}},
    {"id": 3, "text": "Natural language processing enables computers to understand human language", "metadata": {"category": "NLP"}},
]

# Embed and index
for doc in documents:
    embedding, _ = model.embed([doc['text']])
    client.upsert(
        "documents",
        points=[{
            "id": doc['id'],
            "vector": embedding[0],
            "payload": doc['metadata']
        }]
    )
```

### Step 4: Query

```python
# Search for similar documents
query_embedding, _ = model.embed(["machine learning"])
results = client.query(
    "documents",
    query=query_embedding[0],
    limit=5
)

# Display results
for result in results:
    print(f"Score: {result.score:.4f}")
    print(f"ID: {result.id}")
    print(f"Payload: {result.payload}")
```

---

## 5. Use Cases

### Use Case 1: Semantic Search Engine

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

# Setup
client = QdrantClient(url="http://localhost:6333")
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Index articles
articles = [
    {"id": 1, "title": "Introduction to AI", "content": "AI is transforming industries..."},
    {"id": 2, "title": "Deep Learning Basics", "content": "Neural networks are powerful..."},
    # ... more articles
]

for article in articles:
    embedding, _ = model.embed([article['content']])
    client.upsert("articles", points=[{
        "id": article['id'],
        "vector": embedding[0],
        "payload": {"title": article['title'], "content": article['content']}
    }])

# Search
query_embedding, _ = model.embed(["what is artificial intelligence"])
results = client.query("articles", query=query_embedding[0], limit=5)
```

### Use Case 2: Image Search

```python
from fastembed import ImageEmbedding
from qdrant_client import QdrantClient

# Setup
client = QdrantClient(url="http://localhost:6333")
image_model = ImageEmbedding(model_name="Qdrant/resnet50-onnx")

# Create image collection
client.create_collection(
    collection_name="images",
    vectors_config={
        "image": models.VectorParams(size=2048, distance=models.Distance.DOT)
    }
)

# Index images
images = [
    {"id": 1, "image_path": "/path/to/image1.jpg", "tags": ["dog", "outdoor"]},
    {"id": 2, "image_path": "/path/to/image2.jpg", "tags": ["cat", "indoor"]},
]

for image in images:
    embedding, _ = image_model.embed([image['image_path']])
    client.upsert("images", points=[{
        "id": image['id'],
        "vector": embedding[0],
        "payload": {"image_path": image['image_path'], "tags": image['tags']}
    }])

# Search
query_embedding, _ = image_model.embed(["/path/to/query_image.jpg"])
results = client.query("images", query=query_embedding[0], limit=10)
```

### Use Case 3: Duplicate Detection

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

# Setup
client = QdrantClient(url="http://localhost:6333")
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Index documents
documents = [
    {"id": 1, "text": "Machine learning tutorial...", "source": "article1"},
    {"id": 2, "text": "Deep learning guide...", "source": "article2"},
]

for doc in documents:
    embedding, _ = model.embed([doc['text']])
    client.upsert("documents", points=[{
        "id": doc['id'],
        "vector": embedding[0],
        "payload": doc
    }])

# Check for duplicates
new_document = "Machine learning tutorial for beginners..."
embedding, _ = model.embed([new_document])

results = client.query("documents", query=embedding[0], limit=10)

# Find duplicates
for result in results:
    if result.score > 0.85:  # High similarity threshold
        print(f"Found duplicate: {result.payload['source']}")
```

---

## 6. Performance Considerations

### Latency Optimization

```python
# Use smaller models for faster inference
model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")  # ~15ms

# Batch processing
documents = [...]  # Up to 256 documents
embeddings, _ = model.embed(documents)  # Parallel processing

# Use GPU acceleration
import torch
torch.cuda.set_device(0)  # Set GPU device
```

### Memory Optimization

```python
# Use quantization to reduce memory usage
client.create_collection(
    collection_name="optimized",
    vectors_config={
        "text": models.VectorParams(
            size=384,
            distance=models.Distance.COSINE,
            quantization=models.QuantizationConfig(
                quantization_type=models.QuantizationType.BINARY,
                always_ram=True
            )
        )
    }
)
```

### Throughput Optimization

```python
# Configure HNSW for better performance
client.create_collection(
    collection_name="high-performance",
    vectors_config={
        "text": models.VectorParams(
            size=384,
            distance=models.Distance.COSINE,
            hnsw_config=models.HnswConfigDiff(
                m=16,
                ef_construction=100
            )
        )
    }
)
```

---

## 7. Troubleshooting

### Issue 1: Model Download Fails

```python
# Download model manually
import subprocess
subprocess.run(["pip", "install", "sentence-transformers"])

# Then initialize
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
```

### Issue 2: Out of Memory

```python
# Reduce batch size
batch_size = 32
for i in range(0, len(documents), batch_size):
    batch = documents[i:i+batch_size]
    embeddings, _ = model.embed(batch)
```

### Issue 3: Slow Queries

```python
# Increase HNSW parameters
client.create_collection(
    collection_name="optimized",
    vectors_config={
        "text": models.VectorParams(
            size=384,
            distance=models.Distance.COSINE,
            hnsw_config=models.HnswConfigDiff(
                m=32,
                ef_construction=200
            )
        )
    }
)
```

---

## 8. Best Practices

### Model Selection

1. **For production**: Use `BAAI/bge-small-en-v1.5` or `sentence-transformers/all-MiniLM-L6-v2`
2. **For multilingual**: Use `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
3. **For high accuracy**: Use `intfloat/multilingual-e5-large`
4. **For speed**: Use `Qdrant/bm25` for sparse search

### Configuration

1. **Always specify `wait=True`** for upsert operations
2. **Use appropriate distance metrics**:
   - `COSINE` for text embeddings
   - `DOT` for image embeddings
3. **Batch operations** when possible
4. **Monitor GPU memory** when using GPU acceleration

### Error Handling

```python
try:
    model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    embeddings, _ = model.embed(documents)
    client.upsert("documents", points=[...])
except Exception as e:
    print(f"Error: {e}")
    # Implement retry logic
    pass
```

---

## 9. Appendices

### Appendix A: Model Comparison Matrix

| Model | Size | Latency | Accuracy | Best For |
|-------|------|---------|----------|----------|
| `Qdrant/bm25` | 10MB | ~1ms | Good | Real-time sparse search |
| `BAAI/bge-small-en-v1.5` | 67MB | ~15ms | Good | General-purpose |
| `sentence-transformers/all-MiniLM-L6-v2` | 90MB | ~20ms | Good | General-purpose |
| `intfloat/multilingual-e5-large` | 2.24GB | ~50ms | Excellent | High-accuracy multilingual |

### Appendix B: Quick Reference

```python
# Create collection
client.create_collection(
    collection_name="my_collection",
    vectors_config={
        "my_vector": models.VectorParams(size=384, distance=models.Distance.COSINE)
    }
)

# Upsert points
client.upsert(
    collection_name="my_collection",
    points=[
        {
            "id": 1,
            "vector": [0.1, 0.2, 0.3, ...],
            "payload": {"title": "Sample", "description": "..."}
        }
    ]
)

# Query points
results = client.query(
    collection_name="my_collection",
    query=[0.1, 0.2, 0.3, ...],
    using="my_vector",
    limit=10
)
```

---

**Version**: v0.1.0  
**Last Updated**: 2026-04-06  
**Maintained by**: Qdrant  
**Originally created by**: Nirant Kasliwal
