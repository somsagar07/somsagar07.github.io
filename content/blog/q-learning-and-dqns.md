---
title: "Q-Learning and DQNs"
date: "2024-08-27"
category: "Learning"
tags: ["Reinforcement Learning"]
description: "Exploring Q-learning and Deep Q-Networks."
source: "https://www.notion.so/1368157ad43a8038898cc61b8325b812"
---

## Q learning

`Q-learning` is a foundational algorithm in `reinforcement learning` that allwos an agent to learn an optimal action-value fiunction (Q-function), representing the `maximum expected cumulative reward `achievable from rach state-action pair.

Q-learning is a value based method. The aim is to learn an optimal action-value funcion $Q^*(s,a)$ which provides the maximum expected cumulative reward for each state-action pair.

$$
Q^*(s, a) = \max_{\pi} \mathbb{E} \left[ \sum_{t=0}^{\infty} \gamma^t R(s_t, a_t) \, \big| \, s_0 = s, a_0 = a \right]
$$

where $\pi$ is a policy, t is the timestep and $\gamma$ discounts future rewards. The agents objective is to find an optimal policy $\pi^*$ that maximizes its expected cumulative reward by following the action with the highest Q\* in each state.

### Bellman Optimality Equation

The `bellman equation` is the key to understanding Q-learning. The bellman equation for the optimal Q-function is given as:

$$
Q^*(s,a) = \mathbb{E}_{s'}[R(s,a)+\gamma\max_{a'}Q^*(s',a')]
$$

This equation expresses that the optimal Q-value of a state-action pair (s,a) is the immediate reward R(s,a) plus the discounted maximum Q-value of the next state-action pair (s’,a’).

Q-learning approximates the bellman optimality equation through an iterative update process. The agent updates its Q-values as it interacts with the environment. Given an experience tuple (s,a,R,s’). The Q-value update rule is:

$$
Q(s,a) \leftarrow Q(s,a) + \alpha[R + \gamma\max_{a'}Q(s',a')-Q(s,a)]
$$

where:

- Q(s,a): The current estimate of the Q-value.

- $\alpha$: The learning rate, controlling how much new information overrides the old.

- $R+\gamma\max_{a'}Q(s',a')$: The target Q-value for the current step.

- $[R+\gamma\max_{a'}Q(s',a')-Q(s,a)]$: The temporal difference (TD) error, representing the difference between the current Q-value and the target.

The update rule is applied iteratively across episodes, helping the agent converge towards the optimal Q-values. 

#### Temporal Difference (TD) Learning

TD forms the foundation of Q-learning. The TD error reflects how much the Q value for (s,a) needs to be adjusted to better reflect the expected future rewards. Q-learning minimizes this TD error over time, converging to the optimzal Q-values.

#### Convergance of Q-Learning

Under certain conditions, Q-learning converges well to the optimal Q-function Q\*(s,a):

- `Learning Rate`: The learning rate $\alpha_t$ decreases over time.

- `Exploration`: The agent must continue to explore all state-action pairs infinitely often. This ensures it has enough data to learn about each state and action.

Convergance is assured as long as:  $lim_{t\rightarrow\infty} Q_t(s,a) = Q^*(s,a)$

#### Pseudo Algorithm

```python
Initialize Q(s, a) arbitrarily for all s, a
for each episode:
    Initialize state s
    for each step in the episode:
        Choose action a using ε-greedy policy
        Take action a, observe reward R, and next state s'
        Update Q(s, a):
            Q(s, a) ← Q(s, a) + α [R + γ max_a' Q(s', a') - Q(s, a)]
        Set s ← s'
    until s is a terminal state
```

## DQN

DQN stands for `Deep Q Networks`. Traditional Q learning uses a table to store Q-values. which becomes impractical in large or continous state space. DQN solves this by `using a neural network to approximate the Q function` Q(s,a) allowing the agent to generatlize across states and handle complex observations such as images.

### Neural Network as a function approximator

In DQN a neural network with weights $\theta$ takes the state s as input and outputs Q-values for each possible action a: $Q(s,a,\theta)$. Here $\theta$ is the parameters of the network which DQN learns over time. Instead of storing a table of Q-values the network generalizes to predict Q-values for any state-action pair, based on learning features.

#### Core Components

DQN introduces three key components to address the limitations of Q-learning and make the neural network more stable.

1. `Experience Relay`: In standard Q learning, consecutive experience are used to update the Q values. which can lead to instability, as these experiences are correlate. Experience replay breaks the correaltion by storing each experience (s,a,R,s’) in a replay buffer. During training, random mini batches are sampled from this buffer, which:

    1. `Reduces variability` in updates by mixing experience from different parts of the episode.

    1. Allows the agent to `reuse past experience` multiple times, improving efficiency.

1. `Target Network`: DQN uses two seperate networks:

    1. Q network (online network): The main network being trained.

    1. Target network: A copy of the Q network provides stable target for the Q value updates.

The target networks weights are only` updated periodically (eg, every few steps)` by copying the weights from the Q network. This seperation `stabilizes training` by providing a slowly changing target, reduces oscillations in Q-value updates.

1. `Loss function` and `Target Q values:` For each experience tuple (s,a,R,s’) sampled form the replay buffer, DQN computes the target Q-value using the target network:

$$
y=R+\gamma\max_{a'}Q(s',a';\theta^-)
$$

here $\theta^-:$ parameters of the target network, $\max_{a'}Q(s',a';\theta^-)$: The maximum Q-value for the next state s’, computed using the target network.

The Q networks loss function is the MSE between the target Q value y and the Q value predicted by the Q network for tha action a taken in state s. By minimizing the loss DQN updates the Q network to bring the predicted Q-values closer to the target values.

#### DQN Update Rule and Learning Process

The update process in DQN is similar to Q learning but with neural network updates.

```python
Initialize the replay buffer, Q-network and target network.

for each episode:
	Initialize the state s.
	
	for each step in episode:
	 select action a: Choose action a using e-greedy policy based on Q network.
	 take action and observe reward R: execute action a observe R and next state s'
	 store experience: add tuple (s,a,R,s') to replay buffer
	 sample a mini batch: randomly sample a mini-batcg of experience from replay buffer
	 
	 compute target Q-value y(i) for each experience:
		 y(i) = R(i)+γ*max(Q(s′(i),a′;θ−))
	 compute the loss and update Q-network: Minimize the loss function:
		 L(θ) = 1/|batch| * sum(y-Q(s(i),a(i);θ))**2
	 update target network: periodically copy the Q network weights θ to the target network θ-.
	 
	set s as s' until episode ends. 
```

The weights $\theta$ are optimized using backpropagation and gradient descent to minimize the loss, ensuring the Q-values produced by the Q-network converge to the true Q-values over time.

#### Temporal difference error and loss

For each experience DQN computes the Temporal Difference (TD) Error: $\delta=y-Q(s,a;\theta)$.  
This error represents the difference between the target Q-value and the current Q-value for (s,a). The loss function then squares this error and averages it over the mini-batch.

#### Stability through target network

The target network $\theta^-$ is held fixed for several steps, making y a slowly changing target. This stabilizes training by reducing correlations between $\delta$ values, ensuring that Q-network converges toward the optimzal Q-function Q\* under suitable conditions.

#### Gradient descent update

The gradients of the loss $L(\theta)$ with respeact to $\theta$ are computed using back propagation:

$$
\nabla_\theta L(\theta) = \frac{1}{|batch|}\sum_{i}2\delta_i\nabla_\theta Q(s_i,a_i;\theta)
$$

where $\theta=y_i-Q(s_i,a_i;\theta)$, DQN uses this gradient to update the network parametes via gradient descent beinging the Q-network closer to predicting accurate Q-values.
