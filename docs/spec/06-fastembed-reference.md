# FastEmbed Reference Guide

> **Purpose**: Comprehensive reference for FastEmbed integration with Qdrant, covering supported models, configuration options, and deployment patterns.
> 
> **Status**: v0.1.0 - Initial reference
> 
> **Dependencies**: See [Qdrant Dependency Reference](./05-dependencies.md)

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Supported Models](#2-supported-models)
3. [Model Comparison](#3-model-comparison)
4. [Configuration Options](#4-configuration-options)
5. [Deployment Patterns](#5-deployment-patterns)
6. [Common Use Cases](#6-common-use-cases)
7. [Troubleshooting](#7-troubleshooting)
8. [Performance Benchmarks](#8-performance-benchmarks)
9. [Best Practices](#9-best-practices)

---

## 1. Quick Start

### Installation

```bash
# Using pip
pip install fastembed

# Using conda
conda install -c conda-forge fastembed
```

### Basic Usage

```python
from fastembed import TextEmbedding

# Initialize with default model
model = TextEmbedding()

# Generate embeddings
embeddings, _ = model.embed(["Hello world", "This is a test"])

# Using specific model
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
embeddings, _ = model.embed(["Your text here"])
```

### Integration with Qdrant

```python
from qdrant_client import QdrantClient
from fastembed import TextEmbedding

# Create Qdrant client
client = QdrantClient(url="http://localhost:6333")

# Create collection
client.create_collection(
    collection_name="documents",
    vectors_config={
        "text": {"size": 384, "distance": "Cosine"}
    }
)

# Embed and store
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
embeddings, _ = model.embed(["Sample document"])

# Upsert points
client.upsert(
    collection_name="documents",
    points=[
        {
            "id": 1,
            "vector": embeddings[0],
            "payload": {"text": "Sample document"}
        }
    ]
)
```

---

## 2. Supported Models

### Text Embedding Models

| Model | Dimensions | Description | License | Size (GB) |
|-------|------------|-------------|---------|-----------|
| `BAAI/bge-small-en-v1.5` | 384 | Text embeddings, English | MIT | 0.067 |
| `BAAI/bge-small-zh-v1.5` | 512 | Text embeddings, Chinese | MIT | 0.090 |
| `snowflake/snowflake-arctic-embed-xs` | 384 | Text embeddings, English | Apache-2.0 | 0.090 |
| `sentence-transformers/all-MiniLM-L6-v2` | 384 | Text embeddings, English | Apache-2.0 | 0.090 |
| `jinaai/jina-embeddings-v2-small-en` | 512 | Text embeddings, English | Apache-2.0 | 0.120 |
| `BAAI/bge-small-en` | 384 | Text embeddings, English | MIT | 0.130 |
| `snowflake/snowflake-arctic-embed-s` | 384 | Text embeddings, English | Apache-2.0 | 0.130 |
| `nomic-ai/nomic-embed-text-v1.5-Q` | 768 | Multimodal embeddings | Apache-2.0 | 0.130 |
| `BAAI/bge-base-en-v1.5` | 768 | Text embeddings, English | MIT | 0.210 |
| `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` | 384 | Multilingual embeddings | Apache-2.0 | 0.220 |
| `Qdrant/clip-ViT-B-32-text` | 512 | Multimodal (text&image) | MIT | 0.250 |
| `jinaai/jina-embeddings-v2-base-de` | 768 | Multilingual embeddings | Apache-2.0 | 0.320 |
| `BAAI/bge-base-en` | 768 | Text embeddings, English | MIT | 0.420 |
| `snowflake/snowflake-arctic-embed-m` | 768 | Text embeddings, English | Apache-2.0 | 0.430 |
| `nomic-ai/nomic-embed-text-v1.5` | 768 | Multimodal embeddings | Apache-2.0 | 0.520 |
| `jinaai/jina-embeddings-v2-base-en` | 768 | Text embeddings, English | Apache-2.0 | 0.520 |
| `nomic-ai/nomic-embed-text-v1` | 768 | Multimodal embeddings | Apache-2.0 | 0.520 |
| `snowflake/snowflake-arctic-embed-m-long` | 768 | Text embeddings, English | Apache-2.0 | 0.540 |
| `mixedbread-ai/mxbai-embed-large-v1` | 1024 | Text embeddings, English | Apache-2.0 | 0.640 |
| `jinaai/jina-embeddings-v2-base-code` | 768 | Code embeddings | Apache-2.0 | 0.640 |
| `sentence-transformers/paraphrase-multilingual-MPNet-base-v2` | 768 | Multilingual embeddings | Apache-2.0 | 1.000 |
| `snowflake/snowflake-arctic-embed-l` | 1024 | Text embeddings, English | Apache-2.0 | 1.020 |
| `thenlper/gte-large` | 1024 | Text embeddings, English | MIT | 1.200 |
| `BAAI/bge-large-en-v1.5` | 1024 | Text embeddings, English | MIT | 1.200 |
| `intfloat/multilingual-e5-large` | 1024 | Multilingual embeddings | MIT | 2.240 |

### Sparse Text Embedding Models

| Model | Vocab Size | Description | License | Size (GB) |
|-------|------------|-------------|---------|-----------|
| `Qdrant/bm25` | N/A | BM25 sparse embeddings | Apache-2.0 | 0.010 |
| `Qdrant/bm42-all-minilm-l6-v2-attentions` | 30522 | Light sparse embeddings | Apache-2.0 | 0.090 |
| `prithivida/Splade_PP_en_v1` | 30522 | SPLADE++ implementation | Apache-2.0 | 0.532 |

### Late Interaction Models

| Model | Dimensions | Description | License | Size (GB) |
|-------|------------|-------------|---------|-----------|
| `answerdotai/answerai-colbert-small-v1` | 96 | Multilingual late interaction | Apache-2.0 | 0.13 |
| `colbert-ir/colbertv2.0` | 128 | Late interaction | MIT | 0.44 |
| `jinaai/jina-colbert-v2` | 128 | Jina Colbert | CC-BY-NC-4.0 | 2.24 |

### Image Embedding Models

| Model | Dimensions | Description | License | Size (GB) |
|-------|------------|-------------|---------|-----------|
| `Qdrant/resnet50-onnx` | 2048 | Image embeddings, 2016 | Apache-2.0 | 0.10 |
| `Qdrant/clip-ViT-B-32-vision` | 512 | Multimodal (text&image) | MIT | 0.34 |
| `Qdrant/Unicom-ViT-B-32` | 512 | Multimodal (text&image) | Apache-2.0 | 0.48 |
| `Qdrant/Unicom-ViT-B-16` | 768 | Multimodal (text&image) | Apache-2.0 | 0.82 |

### Rerank Cross Encoder Models

| Model | Size (GB) | Description | License |
|-------|-----------|-------------|---------|
| `Xenova/ms-marco-MiniLM-L-6-v2` | 0.08 | MiniLM-L-6-v2 for re-ranking | Apache-2.0 |
| `Xenova/ms-marco-MiniLM-L-12-v2` | 0.12 | MiniLM-L-12-v2 for re-ranking | Apache-2.0 |
| `jinaai/jina-reranker-v1-tiny-en` | 0.13 | Fast re-ranking (8K context) | Apache-2.0 |
| `jinaai/jina-reranker-v1-turbo-en` | 0.15 | Fast re-ranking (8K context) | Apache-2.0 |
| `BAAI/bge-reranker-base` | 1.04 | Base reranker model | MIT |
| `jinaai/jina-reranker-v2-base-multilingual` | 1.11 | Multilingual reranker | CC-BY-NC-4.0 |

---

## 3. Model Comparison

### Performance vs Quality Trade-offs

#### For Speed-Critical Applications

| Model | Latency | Throughput | Use Case |
|-------|---------|------------|----------|
| `Qdrant/bm25` | ~1ms | Very High | Real-time sparse search |
| `Qdrant/bm42-all-minilm-l6-v2-attentions` | ~2ms | High | Fast sparse embeddings |
| `sentence-transformers/all-MiniLM-L6-v2` | ~10-20ms | High | General-purpose embeddings |
| `BAAI/bge-small-en-v1.5` | ~15ms | High | Fast dense embeddings |

#### For Quality-Critical Applications

| Model | Accuracy | Memory | Use Case |
|-------|----------|--------|----------|
| `intfloat/multilingual-e5-large` | Very High | 2.24GB | High-accuracy multilingual |
| `BAAI/bge-large-en-v1.5` | Very High | 1.20GB | Large-scale English |
| `thenlper/gte-large` | Very High | 1.20GB | General high-quality |
| `mixedbread-ai/mxbai-embed-large-v1` | Very High | 0.64GB | Scientific/mathematical |

#### For Multimodal Applications

| Model | Text Dim | Image Dim | Use Case |
|-------|----------|-----------|----------|
| `Qdrant/clip-ViT-B-32-text` | 512 | N/A | Text-only multimodal |
| `Qdrant/clip-ViT-B-32-vision` | N/A | 512 | Image-only multimodal |
| `Qdrant/Unicom-ViT-B-32` | 512 | 512 | Combined text+image |

---

## 4. Configuration Options

### Collection Configuration

```python
from qdrant_client import QdrantClient, models

client = QdrantClient(url="http://localhost:6333")

# Create collection with named vectors
client.create_collection(
    collection_name="documents",
    vectors_config={
        "text": models.VectorParams(
            size=384,
            distance=models.Distance.COSINE,
            hnsw_config=models.HnswConfigDiff(
                m=16,
                ef_construction=100
            )
        ),
        "image": models.VectorParams(
            size=512,
            distance=models.Distance.COSINE
        ),
        "text-sparse": models.SparseVectorParams(
            index=models.SparseIndexConfig(
                on_disk=True
            )
        )
    }
)
```

### Vector Configuration Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `size` | int | Vector dimensionality (384, 512, 768, 1024, etc.) |
| `distance` | Distance enum | Similarity metric (COSINE, DOT, EUCLID, etc.) |
| `hnsw_config.m` | int | HNSW index M parameter (default: 16) |
| `hnsw_config.ef_construction` | int | HNSW construction EF (default: 100) |
| `quantization` | QuantizationConfig | Quantization settings (optional) |

### Distance Metrics

| Metric | Use Case | Best For |
|--------|----------|----------|
| `COSINE` | Semantic similarity | Text embeddings |
| `DOT` | Normalized vectors | Image embeddings |
| `EUCLID` | Absolute difference | Physical measurements |
| `MANHATTAN` | City-block distance | Grid-based data |
| `HAMMING` | Binary vectors | Binary data |

---

## 5. Deployment Patterns

### Pattern 1: Single-Collection Multi-Modal

```python
from qdrant_client import QdrantClient, models

client = QdrantClient(url="http://localhost:6333")

# Create collection with multiple vector spaces
client.create_collection(
    collection_name="multimodal-documents",
    vectors_config={
        "text": models.VectorParams(size=384, distance=models.Distance.COSINE),
        "image": models.VectorParams(size=512, distance=models.Distance.COSINE),
        "text-sparse": models.SparseVectorParams()
    }
)

# Upsert points with multiple vectors
client.upsert(
    collection_name="multimodal-documents",
    points=[
        {
            "id": 1,
            "vector": {
                "text": [0.1, 0.2, 0.3, ...],  # 384-dim
                "image": [0.4, 0.5, 0.6, ...],  # 512-dim
                "text-sparse": {
                    "indices": [1, 3, 5],
                    "values": [0.1, 0.2, 0.3]
                }
            },
            "payload": {
                "title": "Sample Document",
                "image_url": "https://example.com/image.jpg",
                "text_content": "Sample text content"
            }
        }
    ]
)

# Query using specific vector space
client.query(
    collection_name="multimodal-documents",
    query=[0.1, 0.2, 0.3, ...],  # text query vector
    using="text",
    limit=10
)
```

### Pattern 2: Separate Collections per Modality

```python
# Text-only collection
client.create_collection(
    collection_name="text-documents",
    vectors_config={
        "text": models.VectorParams(size=384, distance=models.Distance.COSINE)
    }
)

# Image-only collection
client.create_collection(
    collection_name="image-documents",
    vectors_config={
        "image": models.VectorParams(size=512, distance=models.Distance.COSINE)
    }
)

# Upsert text
client.upsert("text-documents", points=[{
    "id": 1,
    "vector": text_vector,
    "payload": {"title": "Document", "description": "..."}
}])

# Upsert image
client.upsert("image-documents", points=[{
    "id": 1,
    "vector": image_vector,
    "payload": {"title": "Image", "url": "..."}
}])
```

### Pattern 3: Hybrid Search with Reranking

```python
from fastembed import TextEmbedding, TextCrossEncoder

# Initialize models
embedding_model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
reranker = TextCrossEncoder(model_name="jinaai/jina-reranker-v1-tiny-en")

# Embed query
query_embedding, _ = embedding_model.embed(["What is AI?"])

# Retrieve initial results
initial_results = client.query(
    collection_name="documents",
    query=query_embedding[0],
    limit=100
)

# Rerank results
reranked_results = reranker.rerank_pairs([
    (query_embedding[0], point.payload["text"])
    for point in initial_results
])

# Sort by rerank score
reranked_results.sort(key=lambda x: x[1], reverse=True)
```

### Pattern 4: Batch Processing

```python
from fastembed import TextEmbedding

model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Batch embed multiple documents
documents = [
    "Document 1 content...",
    "Document 2 content...",
    "Document 3 content...",
    # ... up to 256 documents
]

embeddings, _ = model.embed(documents)  # Batch processing

# Upsert in batch
client.upsert(
    collection_name="documents",
    points=[
        {
            "id": i,
            "vector": embeddings[i],
            "payload": {"text": documents[i]}
        }
        for i in range(len(documents))
    ]
)
```

---

## 6. Common Use Cases

### Use Case 1: Semantic Search

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

# Setup
client = QdrantClient(url="http://localhost:6333")
client.create_collection(
    collection_name="articles",
    vectors_config={"text": models.VectorParams(size=384, distance=models.Distance.COSINE)}
)

# Index articles
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
for article_id, title, content in articles:
    embedding, _ = model.embed([content])
    client.upsert("articles", points=[
        {
            "id": article_id,
            "vector": embedding[0],
            "payload": {"title": title, "content": content}
        }
    ])

# Search
query_embedding, _ = model.embed(["machine learning"])
results = client.query("articles", query=query_embedding[0], limit=5)
```

### Use Case 2: Duplicate Detection

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")
client.create_collection(
    collection_name="documents",
    vectors_config={"text": models.VectorParams(size=384, distance=models.Distance.COSINE)}
)

model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Add documents
for doc_id, content in documents:
    embedding, _ = model.embed([content])
    client.upsert("documents", points=[
        {
            "id": doc_id,
            "vector": embedding[0],
            "payload": {"content": content}
        }
    ])

# Find duplicates
query_embedding, _ = model.embed([new_content])
similar = client.query("documents", query=query_embedding[0], limit=10)

# Check similarity scores
for result in similar:
    if result.score > 0.85:  # High similarity threshold
        print(f"Found duplicate: {result.payload['content']}")
```

### Use Case 3: Multi-Modal Search

```python
from fastembed import TextEmbedding, ImageEmbedding
from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")

# Create collection with text and image vectors
client.create_collection(
    collection_name="multimodal",
    vectors_config={
        "text": models.VectorParams(size=384, distance=models.Distance.COSINE),
        "image": models.VectorParams(size=512, distance=models.Distance.COSINE)
    }
)

# Add documents with both text and image
text_model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
image_model = ImageEmbedding(model_name="Qdrant/resnet50-onnx")

for doc_id, title, text, image_path in documents:
    text_embedding, _ = text_model.embed([text])
    image_embedding, _ = image_model.embed([image_path])
    
    client.upsert("multimodal", points=[
        {
            "id": doc_id,
            "vector": {
                "text": text_embedding[0],
                "image": image_embedding[0]
            },
            "payload": {"title": title, "text": text, "image_path": image_path}
        }
    ])

# Search by text
text_results = client.query(
    "multimodal",
    query=text_query_vector,
    using="text",
    limit=10
)

# Search by image
image_results = client.query(
    "multimodal",
    query=image_query_vector,
    using="image",
    limit=10
)
```

### Use Case 4: Question Answering with RAG

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

# Setup RAG system
client = QdrantClient(url="http://localhost:6333")
client.create_collection(
    collection_name="knowledge-base",
    vectors_config={"text": models.VectorParams(size=384, distance=models.Distance.COSINE)}
)

# Index knowledge base
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
for chunk_id, chunk in chunks:
    embedding, _ = model.embed([chunk])
    client.upsert("knowledge-base", points=[
        {
            "id": chunk_id,
            "vector": embedding[0],
            "payload": {"chunk": chunk, "source": chunk_source}
        }
    ])

# Query and retrieve
query_embedding, _ = model.embed([user_question])
results = client.query("knowledge-base", query=query_embedding[0], limit=5)

# Construct answer from retrieved chunks
context = [result.payload["chunk"] for result in results]
answer = generate_answer(user_question, context)
```

---

## 7. Troubleshooting

### Issue 1: Model Download Errors

```python
from fastembed import TextEmbedding

try:
    model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error: {e}")
    print("Try downloading model manually:")
    print(f"pip install sentence-transformers")
    print(f"Then: model = TextEmbedding(model_name='sentence-transformers/all-MiniLM-L6-v2')")
```

### Issue 2: Memory Limit Exceeded

```python
# Reduce batch size
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Process in smaller batches
batch_size = 32
for i in range(0, len(documents), batch_size):
    batch = documents[i:i+batch_size]
    embeddings, _ = model.embed(batch)
```

### Issue 3: Embedding Dimension Mismatch

```python
# Check model dimensions
model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
embeddings, _ = model.embed(["test"])
print(f"Embedding dimension: {len(embeddings[0])}")  # Should be 384

# Verify collection configuration
collection_info = client.get_collection("documents")
print(f"Collection vector size: {collection_info.config.vectors['text'].size}")
```

### Issue 4: Slow Embedding Generation

```python
# Use smaller model for faster inference
model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

# Or use GPU acceleration
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "0"  # Set GPU device
```

---

## 8. Performance Benchmarks

### Latency Comparison (per document)

| Model | CPU Latency | GPU Latency | Throughput |
|-------|-------------|-------------|-------------|
| `Qdrant/bm25` | ~1ms | ~1ms | ~1000 docs/s |
| `sentence-transformers/all-MiniLM-L6-v2` | ~15ms | ~5ms | ~100 docs/s |
| `BAAI/bge-small-en-v1.5` | ~12ms | ~4ms | ~120 docs/s |
| `intfloat/multilingual-e5-large` | ~50ms | ~15ms | ~30 docs/s |

### Memory Usage

| Model | CPU Memory | GPU Memory |
|-------|------------|------------|
| `Qdrant/bm25` | ~50MB | ~50MB |
| `sentence-transformers/all-MiniLM-L6-v2` | ~200MB | ~150MB |
| `BAAI/bge-small-en-v1.5` | ~180MB | ~140MB |
| `intfloat/multilingual-e5-large` | ~2.5GB | ~2.0GB |

---

## 9. Best Practices

### Model Selection Guidelines

1. **For production systems**: Use `BAAI/bge-small-en-v1.5` or `sentence-transformers/all-MiniLM-L6-v2` for best balance of speed and quality.

2. **For multilingual applications**: Use `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` or `intfloat/multilingual-e5-large`.

3. **For high-accuracy requirements**: Use `intfloat/multilingual-e5-large` or `BAAI/bge-large-en-v1.5`.

4. **For real-time applications**: Use `Qdrant/bm25` for sparse search or `sentence-transformers/all-MiniLM-L6-v2` for dense search.

5. **For multimodal applications**: Use `Qdrant/clip-ViT-B-32` for image embeddings.

### Configuration Best Practices

1. **Always specify `wait=True`** for upsert operations to ensure data consistency.

2. **Use appropriate distance metrics**:
   - `COSINE` for text embeddings
   - `DOT` for image embeddings
   - `EUCLID` for physical measurements

3. **Batch operations** when possible to improve throughput.

4. **Monitor GPU memory** when using GPU acceleration.

5. **Index collections** after upserting data for optimal query performance.

### Error Handling

```python
from fastembed import TextEmbedding
from qdrant_client import QdrantClient

try:
    model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    embeddings, _ = model.embed(documents)
    
    client.upsert("documents", points=[
        {
            "id": i,
            "vector": embeddings[i],
            "payload": {"text": documents[i]}
        }
        for i in range(len(documents))
    ])
    
except Exception as e:
    print(f"Error: {e}")
    # Implement retry logic or fallback strategies
    pass
```

---

## Appendix A: Model Licensing

| Model | License |
|-------|---------|
| `BAAI/*` | MIT |
| `sentence-transformers/*` | Apache-2.0 |
| `jinaai/*` | CC-BY-NC-4.0 |
| `nomic-ai/*` | Apache-2.0 |
| `Qdrant/*` | Apache-2.0 |
| `thenlper/*` | MIT |
| `mixedbread-ai/*` | Apache-2.0 |
| `snowflake/*` | Apache-2.0 |

---

## Appendix B: Quick Reference

### Model Size vs Dimension Mapping

| Size (GB) | Dimensions | Example Models |
|-----------|------------|----------------|
| 0.01-0.10 | 384-512 | `Qdrant/bm25`, `BAAI/bge-small-en-v1.5` |
| 0.10-0.30 | 384-512 | `sentence-transformers/all-MiniLM-L6-v2`, `jinaai/jina-embeddings-v2-small-en` |
| 0.30-0.60 | 512-768 | `Qdrant/clip-ViT-B-32-text`, `BAAI/bge-base-en-v1.5` |
| 0.60-1.20 | 768-1024 | `nomic-ai/nomic-embed-text-v1.5`, `BAAI/bge-large-en-v1.5` |
| 1.20+ | 1024 | `intfloat/multilingual-e5-large`, `thenlper/gte-large` |

### Common Qdrant Operations

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
            "vector": [0.1, 0.2, 0.3, ...],  # 384-dim vector
            "payload": {"title": "Sample", "description": "..."}
        }
    ]
)

# Query points
results = client.query(
    collection_name="my_collection",
    query=[0.1, 0.2, 0.3, ...],  # Query vector
    using="my_vector",
    limit=10,
    score_threshold=0.5
)

# Delete points
client.delete(
    collection_name="my_collection",
    points_selector=[1, 2, 3]
)

# Update points
client.upsert(
    collection_name="my_collection",
    points=[
        {
            "id": 1,
            "payload": {"updated_payload": "..."}
        }
    ]
)
```

---

**Version**: v0.1.0  
**Last Updated**: 2026-04-06  
**Maintained by**: Qdrant  
**Originally created by**: Nirant Kasliwal
