---
title: "Gaussian Mixture Models"
date: "2024-03-19"
category: "Learning"
tags: ["Classical ML"]
description: "GMM is a probabilistic model that clusters data by assuming it comes from a mix of multiple Gaussian distributions."
source: "https://www.notion.so/1358157ad43a803daad2ecec17859a68"
---

Since most datasets can be modelled using a gaussian distribution. we can assume that clusters come from different gaussians.

A `Gaussian mixture model` (GMM) is a `soft clustering technique` used in unsupervised learning to determine the `probability `that a given data point belongs to a cluster.

A Gaussian mixture is a function that is composed of several Gaussians, each identified by *k* ∈ {1,…, *K*}, where *K* is the number of clusters of our data set. Each gaussian is defined using its mean $\mu$ which defines its center, a covariance $\sum$ which defines its width and a mixing probability $\pi$ which defines the size of the gaussian. The mixing coefficients are themselves probabilities and must meet this condition $\sum\pi_k = 1$. 

In one dimension the gaussian distribution the probability density function (PDF) is given by:

<figure>
  <img src="/blog/assets/images/gaussian-mixture-models-01.png" alt="Probability density function of a one-dimensional Gaussian distribution." width="240" loading="lazy" decoding="async">
</figure>

A multivariant gaussian distribution, the PDF is given as 

<figure>
  <img src="/blog/assets/images/gaussian-mixture-models-02.png" alt="Probability density function of a multivariate Gaussian distribution." width="574" loading="lazy" decoding="async">
</figure>

Since there are K such clusters and the probability density is defined as a linear function of densities of all these K distributions, i.e.

<figure>
  <img src="/blog/assets/images/gaussian-mixture-models-03.png" alt="Gaussian mixture density as a weighted sum of component densities." width="316" loading="lazy" decoding="async">
</figure>

For estimating the parameters we use maximum log-likelihood method and take its derivative nad compute to get.   


<figure>
  <img src="/blog/assets/images/gaussian-mixture-models-04.png" alt="Maximum-likelihood parameter estimate for a Gaussian mixture model." width="194" loading="lazy" decoding="async">
</figure>

<figure>
  <img src="/blog/assets/images/gaussian-mixture-models-05.png" alt="A parameter update in Gaussian mixture estimation." width="221" loading="lazy" decoding="async">
</figure>

$\gamma_k(X)$ is a random variable such that $\gamma_k(X)=P(k|X)$.

> Here $\sum\gamma_k(x_n)$ is the total number of sample points in the kth cluster. 

## **Expectation-Maximization**

The expectation maximization(EM) algorithm is an iterative way to find maximum-likelihood estimates for model parameters when the data is incomplete or has some missing data points or has some hidden variables.

### Estimation step

In the estimation step, we first initialize our model parameters like the mean, covariance matrix, and mixing coefficients.

- For each data point, We calculate the posterior probabilities of data points belonging to each centroid using the current parameter values. These probabilities are represented by the $\gamma_k$.

- At the end Estimate the values of the latent variables $\gamma_k$ based on the current parameter values

### Maximization step

In the maximization step, we update parameter values

- We will update the mean of the cluster point by taking the weighted average of data points using the corresponding latent variable probabilities

- We will update the covariance matrix  by taking the weighted average of the squared differences between the data points and the mean, using the corresponding latent variable probabilities.

- We will update the mixing coefficients by taking the average of the latent variable probabilities for each component.

```python
class GMM(nn.Module):
    def __init__(self, n_components, n_features):
        super(GMM, self).__init__()
        self.n_components = n_components
        self.n_features = n_features

        self.pi = nn.Parameter(torch.ones(n_components) / n_components)
        self.mu = nn.Parameter(torch.randn(n_components, n_features))
        self.sigma = nn.Parameter(torch.eye(n_features).repeat(n_components, 1, 1))

    def forward(self, x):
        log_prob = []
        for k in range(self.n_components):
            dist = torch.distributions.MultivariateNormal(self.mu[k], self.sigma[k])
            log_prob.append(dist.log_prob(x) + torch.log(self.pi[k]))
        log_prob = torch.stack(log_prob, dim=1)
        return torch.logsumexp(log_prob, dim=1)

    def fit(self, x, n_iterations=1000):
        optimizer = torch.optim.Adam(self.parameters())
        for _ in range(n_iterations):
            optimizer.zero_grad()
            loss = -self.forward(x).mean()
            loss.backward()
            optimizer.step()
```
