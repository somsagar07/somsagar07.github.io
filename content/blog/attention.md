---
title: "Attention"
date: "2024-08-21"
category: "Learning"
tags: ["Foundations", "Deep Learning", "LLMs"]
description: "This blog explains self-attention and its role in modern AI models."
source: "https://www.notion.so/1308157ad43a800b93ccfa5421a2457b"
---

In recent years, `self-attention` has revolutionized the way we approach natural language processing, computer vision, and other fields of artificial intelligence. This powerful mechanism, first popularized by the `Transformer` model, enables networks to weigh the importance of each part of the input in relation to every other part.

In this blog, we’ll break down the fundamentals of self-attention, explore how it works under the hood.

## The Basics of Self-Attention

Self-attention starts by representing each input (e.g., each word) as an` embedding vector`. These vectors are essential because they contain the contextual information for each input, which we’ll use in the following steps to compute attention scores.

<figure>
  <img src="/blog/assets/images/attention-01.png" alt="Word embeddings for the sentence Attention is all you need." width="480" loading="lazy" decoding="async">
</figure>

In Fig 1 we chose a sentence “Attention is all you need”. Assume v1, v2, v3, v4, v5 represents word embeddings of each word in the sentence. This setup illustrates the core idea of self-attention: every input can "pay attention" to every other input based on the relevance computed through vector operations.

## Computing Attention Weights

Now lets get into the actual computation. Here’s the flow:

1. **Dot Product**: Each vector $v$ is compared with every key vector to compute a `dot product`. This gives a `similarity score` $D_{ij}$ for each pair, showing how much one token relates to another.

1. **Normalization**: The similarity scores are `normalized `(often with `softmax`) to ensure they sum up to 1, creating the weights $W_{ij}$.

1. **Weighted Sum**: Each input’s vector (value) is weighted by these attention scores to produce the output for that position.

<figure>
  <img src="/blog/assets/images/attention-02.png" alt="Dot products, normalized attention weights, and weighted sums of word embeddings." width="480" loading="lazy" decoding="async">
</figure>

> In simple terms, self-attention scores the importance of other tokens for each specific token in the sequence. 

After normalizing, we use these scores to compute a weighted average, effectively transforming the input in a way that emphasizes the most relevant parts.

The weighted sum output highlights how attention allows each token to adjust its focus based on context, enabling richer representations.

This works but there are no weights in the above figure we are not ideally learning anything, there is no proximity influence and it shape independent. To  solve this we introduce weights and the only place we can introduce them are with v because they are not used in intermediate compute. We call them using the terms key $M_K$, query $M_Q$ and value $M_V$ as shown below.

<figure>
  <img src="/blog/assets/images/attention-03.png" alt="Self-attention using learned query, key, and value projections." width="432" loading="lazy" decoding="async">
</figure>

The core process of self-attention is shown above, where each input interacts with every other input in the sequence. The goal of self-attention is to create a representation of each token (e.g., a word in a sentence) that captures its relationships with other tokens. 

Here’s how it works, step by step similar to how we computer earlier but this time in much more detail:

1. **Creating Queries (Q), Keys (K), and Values (V):**

    - Each input vector Vi (such as a word embedding) is linearly transformed using weight matrices $M_K, M_Q, M_V$.

    - These transformations produce:

        - **`Query vectors`** **(Q)**: Representing what each token is “looking for.”

        - **`Key vectors`** **(K)**: Representing what each token “contains” that others may want to focus on.

        - **`Value vectors`** **(V)**: Containing the actual content or information that will be passed along.

1. **Calculating Attention Scores:**

    - The query vector for each token is compared with the key vectors of all tokens by computing dot products. This produces a similarity score for each token pair, represented as , $D_{ij}$ which indicates how relevant one token is to another.

    - For example, $D_{12}$ would be the similarity score between the first token and the second token.

1. **Normalization:**

    - The scores are then normalized (often with softmax), resulting in attention weights $W_{ij}$ that sum up to 1. This step ensures the attention distribution is balanced, allowing each token to focus on the most relevant parts of the input.

1. **Weighted Sum Using Values:**

    - The attention weights are applied to the value vectors. Each value vector is weighted according to its corresponding attention score, and the weighted values are summed to produce the output representation $Y_i$ for each token.

    - This output Y1​ represents the token’s contextualized information, with contributions from all other tokens based on their relevance.

## Multi-head Attention

`Multi-head attention` is an extension of self-attention where multiple attention heads (i.e., parallel self-attention mechanisms) are applied to the input. Each head learns different transformations of Q, K, and V, allowing it to focus on various relationships within the data.

In multi-head attention, `the input embeddings are projected into multiple sets of queries, keys, and values`, each corresponding to a different "head." Each head independently performs self-attention, capturing different patterns or aspects of the data. The outputs of all heads are then concatenated and combined to form the final output.

By having multiple heads, the model can focus on `multiple types of relationships` simultaneously. For example, one head might focus on syntactic dependencies (like subject-verb pairs), while another might focus on semantic relationships (like topic coherence). This parallel processing makes the representation more expressive and comprehensive.

## Putting It All Together

- **Recap of Process**:

    - Start with embeddings of each token.

    - Compute dot products between queries and keys to get attention scores.

    - Normalize scores and apply them to the value vectors.

    - Aggregate the results across multiple attention heads.

- **Example**: Suppose we have a sentence with words “Attention is all you need.” The attention mechanism allows the model to relate each word to every other word. Multi-head attention can let the model identify multiple layers of meaning (e.g., subject-verb relationships, semantic emphasis on “all”).

## Conclusion

Self-attention, combined with multi-head attention, is a cornerstone of modern AI, enabling models to capture complex dependencies within sequences. Through queries (Q), keys (K), and values (V), self-attention allows each token to dynamically focus on others, creating context-aware representations. Multi-head attention enhances this by running multiple attention mechanisms in parallel, allowing the model to learn different types of relationships within the data simultaneously. Together, self-attention and multi-head attention provide the flexibility and power that drive breakthroughs in NLP, computer vision, and beyond, setting a new standard for intelligent, adaptable AI models.
