import React from 'react';
import styled, { keyframes } from 'styled-components';

const moveParticle = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(var(--translate-x), var(--translate-y)) rotate(360deg);
  }
`;

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${moveParticle} ${props => props.duration}s linear infinite;
  --translate-x: ${props => props.translateX}px;
  --translate-y: ${props => props.translateY}px;
`;

const ParticlesBackground = () => {
  const particles = Array.from({ length: 50 }).map((_, index) => ({
    id: index,
    size: Math.random() * 4 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    translateX: (Math.random() - 0.5) * 200,
    translateY: (Math.random() - 0.5) * 200,
  }));

  return (
    <ParticleContainer>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          size={particle.size}
          top={particle.top}
          left={particle.left}
          duration={particle.duration}
          translateX={particle.translateX}
          translateY={particle.translateY}
        />
      ))}
    </ParticleContainer>
  );
};

export default ParticlesBackground; 