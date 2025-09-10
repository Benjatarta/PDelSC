import React, { useState, useEffect, useRef, useCallback } from 'react';

// URL de las imágenes para tus assets
import bardockImage from '../extras/bardock.webp';
import freezerShipImage from '../extras/FreezerShip.png';
import ginyuImage from '../extras/ginyu.png';
import saibaimanImage from '../extras/Saibaiman.png';
import scouterImage from '../extras/scouter.png';
import senzuImage from '../extras/Senzu.webp';
import superImage from '../extras/super.png';

// Define las URLs de las imágenes en un objeto
const ASSET_PATHS = {
  player: bardockImage,
  alienType1: saibaimanImage,
  alienType2: ginyuImage,
  alienType3: freezerShipImage,
  laser: scouterImage, // Usaremos el scouter como un láser de ejemplo
  enemyLaser: superImage, // Y la imagen "super" para el láser enemigo
  powerUp: senzuImage, // Senzu bean como power-up
  // Puedes añadir más si las necesitas para explosiones, etc.
};

const ALIEN_WIDTH = 20;
const ALIEN_HEIGHT = 20;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const LASER_WIDTH = 4;
const LASER_HEIGHT = 10;
const SHIELD_BLOCK_SIZE = 8;
const POWER_UP_SIZE = 20;
const SUPER_BEAM_WIDTH = 8;
const SUPER_BEAM_HEIGHT = 40;
const EXPLOSION_SIZE = 30;

// Estado inicial del juego
const initialGameState = {
  gameAreaWidth: 0,
  gameAreaHeight: 0,
  score: 0,
  lives: 3,
  canShoot: true,
  gameMode: 1,
  currentPlayer: 1,
  player1Score: 0,
  player2Score: 0,
  gameRunning: false,
  gamePaused: false,
  returningToMenu: false,
  player: null,
  alienGrid: [],
  shields: [],
  playerLasers: [],
  enemyLasers: [],
  powerUps: [],
  explosions: [],
  superBeams: [],
  alienMovement: {
    offsetX: 0,
    offsetY: 0,
    direction: 1, // 1 for right, -1 for left
    speed: 500, // milliseconds per move
    dropDistance: 25,
    lastMoveTime: 0,
  },
  superReady: false,
  superActive: false,
  superUsed: 0,
  immobilizedUntil: 0,
  aliensFrozen: false,
  alienCounts: {
    type1: { killed: 0, total: 20 },
    type2: { killed: 0, total: 20 },
    type3: { killed: 0, total: 10 },
  },
  alienPoints: {
    type1: 100,
    type2: 200,
    type3: 500,
  },
  superPointsRequired: 1000,
};

// Componente principal del juego
const SpaceInvaders = () => {
  const [gameState, setGameState] = useState(initialGameState);
  const gameAreaRef = useRef(null);
  const gameLoopRef = useRef(null);
  const animationFrameRef = useRef(null);
  const intervalsRef = useRef({});

  // Helper para actualizar el estado inmutablemente
  const updateState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  // Función para obtener todos los aliens activos (simplificada para React)
  const getAllActiveAliens = useCallback(() => {
    const activeAliens = [];
    gameState.alienGrid.forEach(row => {
      row.forEach(alien => {
        if (alien && alien.active) {
          activeAliens.push(alien);
        }
      });
    });
    return activeAliens;
  }, [gameState.alienGrid]);

  // Detección de colisiones
  const isColliding = useCallback((entity1, entity2, width1, height1, width2, height2) => {
    if (!entity1 || !entity2 || !entity1.active || !entity2.active) return false;
    const margin = 2; // Pequeño margen para colisiones más indulgentes
    return (
      entity1.x < entity2.x + width2 - margin &&
      entity1.x + width1 - margin > entity2.x &&
      entity1.y < entity2.y + height2 - margin &&
      entity1.y + height1 - margin > entity2.y
    );
  }, []);

  // Creación de explosión
  const createExplosion = useCallback((x, y) => {
    const id = `explosion-${Date.now()}-${Math.random()}`;
    setGameState(prev => ({
      ...prev,
      explosions: [...prev.explosions, { id, x, y, active: true, timer: 15 }]
    }));
  }, []);

  // Lógica de "hitAlien" (cuando un alien es golpeado)
  const hitAlien = useCallback((id, isSuperAttack = false) => {
    setGameState(prev => {
      const newAlienGrid = prev.alienGrid.map(row =>
        row.map(alien => {
          if (alien && alien.id === id) {
            if (!alien.active) return alien; // Ya inactivo, no hacer nada

            // Crear explosión en la posición actual del alien
            createExplosion(alien.x, alien.y);

            const alienType = alien.type;
            const points = prev.alienPoints[alienType];

            const newAlienCounts = { ...prev.alienCounts };
            newAlienCounts[alienType].killed++;

            let newScore = prev.score;
            if (!isSuperAttack) {
              newScore += points;
              // showScorePopup(points); // Esta función necesitaría un manejo especial en React
            }
            return { ...alien, active: false }; // Marcar como inactivo
          }
          return alien;
        })
      );
      return { ...prev, alienGrid: newAlienGrid };
    });
  }, [createExplosion]);

  // Lógica para el disparo del jugador
  const shoot = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gamePaused || !prev.canShoot || !prev.player) return prev;

      const newPlayerLasers = [...prev.playerLasers];
      const laserId = `player-laser-${Date.now()}`;
      newPlayerLasers.push({
        id: laserId,
        x: prev.player.x + PLAYER_WIDTH / 2 - LASER_WIDTH / 2,
        y: prev.player.y - LASER_HEIGHT,
        active: true,
      });

      return {
        ...prev,
        playerLasers: newPlayerLasers,
        canShoot: false,
      };
    });
    setTimeout(() => updateState({ canShoot: true }), 300);
  }, [updateState]);

  // Lógica para el super ataque
  const trySuperAttack = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gamePaused || !prev.superReady || prev.superActive) return prev;

      return {
        ...prev,
        superActive: true,
        immobilizedUntil: Date.now() + 2000,
        aliensFrozen: true,
        superUsed: prev.superUsed + 1,
        superReady: false,
      };
    });

    let currentY = gameState.player.y;
    const beamX = gameState.player.x + PLAYER_WIDTH / 2 - SUPER_BEAM_WIDTH / 2;

    intervalsRef.current.superBeam = setInterval(() => {
      setGameState(prev => {
        if (prev.gamePaused) return prev;

        const newSuperBeams = [...prev.superBeams];
        const beamId = `super-beam-${Date.now()}-${Math.random()}`;
        newSuperBeams.push({ id: beamId, x: beamX, y: currentY, active: true });
        currentY -= 30;

        if (currentY < -50) {
          clearInterval(intervalsRef.current.superBeam);
          intervalsRef.current.superBeam = null;
          return { ...prev, superActive: false, aliensFrozen: false, superBeams: newSuperBeams };
        }
        return { ...prev, superBeams: newSuperBeams };
      });
    }, 30);
  }, [gameState.player, updateState]);


  // Lógica del disparo enemigo
  const enemyShoot = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gamePaused) return prev;

      const activeAliens = getAllActiveAliens();
      if (activeAliens.length === 0) return prev;

      const shootingAlien = activeAliens[Math.floor(Math.random() * activeAliens.length)];
      const laserId = `enemy-laser-${Date.now()}`;
      const newEnemyLasers = [...prev.enemyLasers, {
        id: laserId,
        x: shootingAlien.x + ALIEN_WIDTH / 2 - LASER_WIDTH / 2,
        y: shootingAlien.y + ALIEN_HEIGHT,
        active: true,
      }];
      return { ...prev, enemyLasers: newEnemyLasers };
    });
  }, [getAllActiveAliens]);

  // Generación de Power-Ups
  const spawnPowerUp = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gamePaused) return prev;

      const x = Math.random() * (prev.gameAreaWidth - POWER_UP_SIZE);
      const powerUpId = `power-up-${Date.now()}`;
      const newPowerUps = [...prev.powerUps, { id: powerUpId, x, y: 0, active: true }];
      return { ...prev, powerUps: newPowerUps };
    });
  }, []);

  // Limpiar todos los intervalos del juego
  const clearAllIntervals = useCallback(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Manejar fin del juego (Game Over)
  const gameOver = useCallback(() => {
    updateState({ gameRunning: false });
    clearAllIntervals();
    if (!gameState.returningToMenu) {
      // alert(`GAME OVER\nSCORE: ${gameState.score}`); // Reemplazar con un modal React
      // setTimeout(backToMenu, 2000); // Volver al menú después de un tiempo
    }
  }, [gameState.returningToMenu, updateState, clearAllIntervals]);

  // Manejar victoria (You Win)
  const youWin = useCallback(() => {
    updateState({ gameRunning: false });
    clearAllIntervals();
    // if (!gameState.returningToMenu) {
    //   alert(`YOU WIN!\nSCORE: ${gameState.score}`); // Reemplazar con un modal React
    //   setTimeout(backToMenu, 2000); // Volver al menú después de un tiempo
    // }
  }, [updateState, clearAllIntervals]);

  // Lógica principal de colisiones (simplificada para React)
  const checkCollisions = useCallback(() => {
    setGameState(prev => {
      if (!prev.player) return prev; // Asegurarse de que el jugador exista

      let newPlayerLasers = [...prev.playerLasers];
      let newEnemyLasers = [...prev.enemyLasers];
      let newShields = [...prev.shields];
      let newAlienGrid = prev.alienGrid.map(row => row.map(alien => ({ ...alien }))); // Clonar para inmutabilidad
      let newPowerUps = [...prev.powerUps];
      let newPlayer = { ...prev.player };
      let newScore = prev.score;
      let newLives = prev.lives;

      const activeAliens = getAllActiveAliens();

      // Colisión de aliens con el jugador
      if (activeAliens.some(alien => isColliding(alien, newPlayer, ALIEN_WIDTH, ALIEN_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT))) {
        gameOver();
        return prev;
      }

      // Todos los aliens destruidos
      if (activeAliens.length === 0) {
        youWin();
        return prev;
      }

      // Player laser vs aliens
      newPlayerLasers = newPlayerLasers.filter(laser => {
        if (!laser.active) return false;
        let laserHit = false;
        newAlienGrid.forEach((row, rowIndex) => {
          row.forEach((alien, colIndex) => {
            if (alien && alien.active && isColliding(laser, alien, LASER_WIDTH, LASER_HEIGHT, ALIEN_WIDTH, ALIEN_HEIGHT)) {
              hitAlien(alien.id, false); // No es super ataque
              newScore += prev.alienPoints[alien.type]; // Actualizar score inmediatamente
              laserHit = true;
            }
          });
        });
        return !laserHit; // Eliminar el láser si golpeó algo
      });

      // Player laser vs shields
      newPlayerLasers = newPlayerLasers.filter(laser => {
        if (!laser.active) return false;
        let laserHitShield = false;
        newShields = newShields.filter(shield => {
          if (!shield.active) return false;
          if (isColliding(laser, shield, LASER_WIDTH, LASER_HEIGHT, SHIELD_BLOCK_SIZE, SHIELD_BLOCK_SIZE)) {
            laserHitShield = true;
            return false; // Eliminar el bloque de escudo
          }
          return true;
        });
        return !laserHitShield; // Eliminar el láser si golpeó un escudo
      });

      // Super beam vs aliens y enemy lasers
      if (prev.superActive) {
        prev.superBeams.forEach(beam => {
          if (!beam.active) return;
          newAlienGrid.forEach((row, rowIndex) => {
            row.forEach((alien, colIndex) => {
              if (alien && alien.active && isColliding(beam, alien, SUPER_BEAM_WIDTH, SUPER_BEAM_HEIGHT, ALIEN_WIDTH, ALIEN_HEIGHT)) {
                hitAlien(alien.id, true); // Es super ataque, no da puntos
              }
            });
          });
          newEnemyLasers = newEnemyLasers.filter(enemyLaser => {
            if (!enemyLaser.active) return false;
            return !isColliding(beam, enemyLaser, SUPER_BEAM_WIDTH, SUPER_BEAM_HEIGHT, LASER_WIDTH, LASER_HEIGHT);
          });
        });
      }

      // Enemy laser vs player
      newEnemyLasers = newEnemyLasers.filter(laser => {
        if (!laser.active) return false;
        if (isColliding(laser, newPlayer, LASER_WIDTH, LASER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT)) {
          createExplosion(newPlayer.x, newPlayer.y);
          newLives--;
          return false; // Eliminar el láser
        }
        return true;
      });

      // Enemy laser vs shields
      newEnemyLasers = newEnemyLasers.filter(laser => {
        if (!laser.active) return false;
        let laserHitShield = false;
        newShields = newShields.filter(shield => {
          if (!shield.active) return false;
          if (isColliding(laser, shield, LASER_WIDTH, LASER_HEIGHT, SHIELD_BLOCK_SIZE, SHIELD_BLOCK_SIZE)) {
            laserHitShield = true;
            return false; // Eliminar el bloque de escudo
          }
          return true;
        });
        return !laserHitShield; // Eliminar el láser si golpeó un escudo
      });

      // Enemy laser vs player laser (colisión de láseres)
      const hitPlayerLasers = new Set();
      newEnemyLasers = newEnemyLasers.filter(enemyLaser => {
        if (!enemyLaser.active) return false;
        let hitByPlayerLaser = false;
        newPlayerLasers.forEach((playerLaser, playerLaserIndex) => {
          if (!playerLaser.active || hitPlayerLasers.has(playerLaser.id)) return; // Skip if already hit

          if (isColliding(enemyLaser, playerLaser, LASER_WIDTH, LASER_HEIGHT, LASER_WIDTH, LASER_HEIGHT)) {
            createExplosion((enemyLaser.x + playerLaser.x) / 2, (enemyLaser.y + playerLaser.y) / 2);
            hitByPlayerLaser = true;
            hitPlayerLasers.add(playerLaser.id); // Marcar el láser del jugador como golpeado
          }
        });
        return !hitByPlayerLaser; // Eliminar el láser enemigo si golpeó un láser del jugador
      });

      // Filtrar los láseres del jugador que fueron golpeados
      newPlayerLasers = newPlayerLasers.filter(laser => !hitPlayerLasers.has(laser.id));


      // Power-up vs player
      newPowerUps = newPowerUps.filter(powerUp => {
        if (!powerUp.active) return false;
        if (isColliding(powerUp, newPlayer, POWER_UP_SIZE, POWER_UP_SIZE, PLAYER_WIDTH, PLAYER_HEIGHT)) {
          createExplosion(powerUp.x, powerUp.y);
          if (newLives < 3) {
            newLives++;
          }
          return false; // Eliminar el power-up
        }
        return true;
      });


      if (newLives <= 0) {
        gameOver();
      }

      return {
        ...prev,
        playerLasers: newPlayerLasers,
        enemyLasers: newEnemyLasers,
        shields: newShields,
        alienGrid: newAlienGrid,
        powerUps: newPowerUps,
        score: newScore,
        lives: newLives,
      };
    });
  }, [getAllActiveAliens, gameOver, youWin, isColliding, hitAlien, createExplosion]);

  // Actualizar posiciones de láseres, power-ups y explosiones
  const updateGameObjects = useCallback(() => {
    setGameState(prev => {
      let newPlayerLasers = prev.playerLasers.map(l => ({ ...l, y: l.y - 5 })).filter(l => l.y > -LASER_HEIGHT);
      let newEnemyLasers = prev.enemyLasers.map(l => ({ ...l, y: l.y + 3 })).filter(l => l.y < prev.gameAreaHeight);
      let newPowerUps = prev.powerUps.map(p => ({ ...p, y: p.y + 2 })).filter(p => p.y < prev.gameAreaHeight);
      let newSuperBeams = prev.superBeams.map(b => ({ ...b, y: b.y - 8 })).filter(b => b.y > -SUPER_BEAM_HEIGHT);
      let newExplosions = prev.explosions.map(e => ({ ...e, timer: e.timer - 1 })).filter(e => e.timer > 0);

      return {
        ...prev,
        playerLasers: newPlayerLasers,
        enemyLasers: newEnemyLasers,
        powerUps: newPowerUps,
        superBeams: newSuperBeams,
        explosions: newExplosions,
      };
    });
  }, []);

  // Lógica del movimiento de los aliens
  const moveAliens = useCallback(() => {
    const currentTime = Date.now();
    setGameState(prev => {
      if (currentTime - prev.alienMovement.lastMoveTime < prev.alienMovement.speed) {
        return prev;
      }

      const newAlienMovement = { ...prev.alienMovement, lastMoveTime: currentTime };
      let newAlienGrid = prev.alienGrid.map(row => row.map(alien => ({ ...alien })));
      const activeAliens = getAllActiveAliens();

      if (activeAliens.length === 0) return prev; // No hay aliens, no mover

      if (prev.superActive) {
        // Movimiento aleatorio en modo súper
        newAlienGrid = newAlienGrid.map(row =>
          row.map(alien => {
            if (alien.active) {
              const randomX = (Math.random() - 0.5) * 3;
              const randomY = (Math.random() - 0.5) * 2;
              let newX = alien.x + randomX;
              let newY = alien.y + randomY;

              newX = Math.max(10, Math.min(prev.gameAreaWidth - ALIEN_WIDTH - 10, newX));
              newY = Math.max(10, Math.min(prev.gameAreaHeight - ALIEN_HEIGHT - 120, newY));
              return { ...alien, x: newX, y: newY };
            }
            return alien;
          })
        );
      } else {
        // Movimiento normal
        let leftmostX = Number.POSITIVE_INFINITY;
        let rightmostX = Number.NEGATIVE_INFINITY;
        let lowestY = Number.NEGATIVE_INFINITY;

        activeAliens.forEach(alien => {
          const alienLeft = alien.baseX + newAlienMovement.offsetX;
          const alienRight = alienLeft + ALIEN_WIDTH;
          const alienBottom = alien.baseY + newAlienMovement.offsetY + ALIEN_HEIGHT;
          leftmostX = Math.min(leftmostX, alienLeft);
          rightmostX = Math.max(rightmostX, alienRight);
          lowestY = Math.max(lowestY, alienBottom);
        });

        let changedDirection = false;
        if (
          (newAlienMovement.direction === 1 && rightmostX >= prev.gameAreaWidth - 10) ||
          (newAlienMovement.direction === -1 && leftmostX <= 10)
        ) {
          newAlienMovement.direction *= -1;
          newAlienMovement.offsetY += newAlienMovement.dropDistance;
          changedDirection = true;
        } else {
          newAlienMovement.offsetX += newAlienMovement.direction * 5; // Aumentar la velocidad horizontal un poco
        }

        // Check if aliens reached the bottom
        if (lowestY >= prev.gameAreaHeight - 50) {
          gameOver();
          return prev;
        }

        // Update alien positions
        newAlienGrid = newAlienGrid.map(row =>
          row.map(alien => {
            if (alien.active) {
              return {
                ...alien,
                x: alien.baseX + newAlienMovement.offsetX,
                y: alien.baseY + newAlienMovement.offsetY,
              };
            }
            return alien;
          })
        );
      }

      return { ...prev, alienGrid: newAlienGrid, alienMovement: newAlienMovement };
    });
  }, [getAllActiveAliens, isColliding, gameOver, gameState.superActive]); // Añadir dependencias necesarias

  // El game loop principal
  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gamePaused) {
        animationFrameRef.current = null;
        return prev;
      }

      // Ajustar velocidad de los aliens
      const totalAliens = prev.alienCounts.type1.total + prev.alienCounts.type2.total + prev.alienCounts.type3.total;
      const aliensKilled = prev.alienCounts.type1.killed + prev.alienCounts.type2.killed + prev.alienCounts.type3.killed;
      const remainingAliens = totalAliens - aliensKilled;

      if (remainingAliens > 0) {
        const speedMultiplier = 1 + ((totalAliens - remainingAliens) / totalAliens) * 3;
        prev.alienMovement.speed = Math.max(50, 500 / speedMultiplier); // Mínimo de 50ms para que no sea demasiado rápido
      } else {
        youWin();
        return prev;
      }

      moveAliens();
      updateGameObjects();
      checkCollisions();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return prev; // Devolver el estado actual para la siguiente iteración
    });
  }, [moveAliens, updateGameObjects, checkCollisions, youWin]);

  // Crear la cuadrícula de aliens
  const createAlienGrid = useCallback(() => {
    const rows = 6;
    const cols = 10;
    const alienStartX = 50;
    const alienStartY = 50;
    const alienSpacingX = 70;
    const alienSpacingY = 50;

    const newAlienGrid = [];
    let type1Count = 0;
    let type2Count = 0;
    let type3Count = 0;

    for (let row = 0; row < rows; row++) {
      newAlienGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        const x = alienStartX + col * alienSpacingX;
        const y = alienStartY + row * alienSpacingY;
        const id = `alien-${row}-${col}`;

        let type, className, image;
        if (row < 1) {
          type = "type3";
          className = "invader type3";
          image = ASSET_PATHS.alienType3;
          type3Count++;
        } else if (row < 3) {
          type = "type2";
          className = "invader type2";
          image = ASSET_PATHS.alienType2;
          type2Count++;
        } else {
          type = "type1";
          className = "invader type1";
          image = ASSET_PATHS.alienType1;
          type1Count++;
        }

        newAlienGrid[row][col] = {
          id,
          x,
          y,
          baseX: x,
          baseY: y,
          type,
          className,
          image,
          active: true,
          gridRow: row,
          gridCol: col,
        };
      }
    }

    setGameState(prev => ({
      ...prev,
      alienGrid: newAlienGrid,
      alienCounts: {
        type1: { killed: 0, total: type1Count },
        type2: { killed: 0, total: type2Count },
        type3: { killed: 0, total: type3Count },
      }
    }));
  }, []);

  // Crear escudos
  const createShields = useCallback(() => {
    const shieldY = gameState.gameAreaHeight - 150;
    const shieldPositions = [
      gameState.gameAreaWidth * 0.15,
      gameState.gameAreaWidth * 0.35,
      gameState.gameAreaWidth * 0.65,
      gameState.gameAreaWidth * 0.85,
    ];

    let newShields = [];
    shieldPositions.forEach((baseX, shieldGroupIndex) => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 6; col++) {
          if (row === 2 && (col === 2 || col === 3)) continue;

          const x = baseX + col * SHIELD_BLOCK_SIZE - SHIELD_BLOCK_SIZE * 3; // Ajustar para centrar
          const y = shieldY + row * SHIELD_BLOCK_SIZE;
          const id = `shield-${shieldGroupIndex}-${row}-${col}`;
          newShields.push({
            id,
            x,
            y,
            type: "shield",
            className: "shield",
            image: ASSET_PATHS.shield,
            active: true,
          });
        }
      }
    });
    updateState({ shields: newShields });
  }, [gameState.gameAreaWidth, gameState.gameAreaHeight, updateState]);

  // Configurar el juego
  const setupGame = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const playerX = rect.width / 2 - PLAYER_WIDTH / 2;
    const playerY = rect.height - 40;

    const player = {
      id: "player",
      x: playerX,
      y: playerY,
      type: "player",
      className: "shooter",
      image: ASSET_PATHS.player,
      active: true,
    };

    updateState({
      gameAreaWidth: rect.width,
      gameAreaHeight: rect.height,
      player,
    });

    createAlienGrid(); // Crea los aliens con el estado actualizado
    createShields(); // Crea los escudos
  }, [updateState, createAlienGrid, createShields]);

  // Iniciar el game loop y los intervalos
  const startGameLoop = useCallback(() => {
    intervalsRef.current.enemyLasers = setInterval(enemyShoot, 1500);
    intervalsRef.current.powerUp = setInterval(spawnPowerUp, 15000);
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [enemyShoot, spawnPowerUp, gameLoop]);

  // Resetear y re-inicializar el juego
  const resetGame = useCallback(() => {
    clearAllIntervals();
    setGameState(initialGameState); // Resetear todo el estado
  }, [clearAllIntervals]);

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    updateState({ gameRunning: true, gamePaused: false, returningToMenu: false });
    resetGame(); // Asegurarse de que el estado inicial se aplique antes de setupGame
    // Usamos un useEffect para `setupGame` para que se ejecute después del reset
    // y cuando gameAreaRef.current esté disponible
  }, [updateState, resetGame]);

  // Funciones del menú
  const startGame = (mode) => {
    updateState({ gameMode: mode });
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initializeGame();
  };

  const backToMenu = () => {
    updateState({ returningToMenu: true });
    clearAllIntervals();
    document.getElementById("menu").style.display = "block";
    document.getElementById("gameContainer").style.display = "none";
    resetGame();
  };

  const togglePause = () => {
    updateState(prev => ({ gamePaused: !prev.gamePaused }));
  };

  // Manejador de eventos de teclado
  const handleKeyDown = useCallback((e) => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gamePaused || !prev.player) return prev;

      let newPlayer = { ...prev.player };
      const moveSpeed = 15;

      switch (e.key) {
        case "ArrowLeft":
          newPlayer.x = Math.max(0, newPlayer.x - moveSpeed);
          break;
        case "ArrowRight":
          newPlayer.x = Math.min(prev.gameAreaWidth - PLAYER_WIDTH, newPlayer.x + moveSpeed);
          break;
        case "ArrowUp":
          e.preventDefault(); // Evitar scroll
          if (prev.canShoot) {
            shoot(); // Llama a la función de disparo
          }
          break;
        case " ": // Space bar
          e.preventDefault(); // Evitar scroll
          if (prev.superReady && !prev.superActive) {
            trySuperAttack(); // Llama a la función de super ataque
          }
          break;
        default:
          return prev;
      }
      return { ...prev, player: newPlayer };
    });
  }, [shoot, trySuperAttack]);

  // Efecto para configurar el juego después de que gameAreaRef esté disponible y el estado se haya reseteado
  useEffect(() => {
    if (gameAreaRef.current && gameState.gameRunning && !gameState.player) {
      setupGame();
      startGameLoop();
    }
  }, [gameAreaRef.current, gameState.gameRunning, gameState.player, setupGame, startGameLoop]);

  // Efecto para los listeners de teclado y limpieza
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearAllIntervals();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleKeyDown, clearAllIntervals]);

  // Efecto para actualizar el HUD cuando el estado relevante cambia
  useEffect(() => {
    // Actualizar score
    const scoreDisplay = document.getElementById("score");
    if (scoreDisplay) scoreDisplay.textContent = gameState.score;

    // Actualizar vidas
    const livesBar = document.getElementById("lives");
    if (livesBar) {
      const lifeSegments = livesBar.querySelectorAll(".life");
      lifeSegments.forEach((segment, i) => {
        segment.className = "life"; // Resetear clases
        if (i < gameState.lives) {
          if (gameState.lives === 2) {
            segment.classList.add("yellow");
          } else {
            segment.classList.add("active");
          }
        } else {
          segment.classList.add("inactive");
        }
      });
      if (gameState.lives === 1) {
        livesBar.classList.add("warning");
      } else {
        livesBar.classList.remove("warning");
      }
    }

    // Actualizar contadores de aliens
    const totalAliensKilled = gameState.alienCounts.type1.killed + gameState.alienCounts.type2.killed + gameState.alienCounts.type3.killed;
    const totalAliens = gameState.alienCounts.type1.total + gameState.alienCounts.type2.total + gameState.alienCounts.type3.total;

    if (document.getElementById("type1Count")) {
      document.getElementById("type1Count").textContent = `${gameState.alienCounts.type1.killed} / ${gameState.alienCounts.type1.total}`;
    }
    if (document.getElementById("type2Count")) {
      document.getElementById("type2Count").textContent = `${gameState.alienCounts.type2.killed} / ${gameState.alienCounts.type2.total}`;
    }
    if (document.getElementById("type3Count")) {
      document.getElementById("type3Count").textContent = `${gameState.alienCounts.type3.killed} / ${gameState.alienCounts.type3.total}`;
    }

    // Actualizar estado del súper orb
    const supersEarned = Math.floor(gameState.score / gameState.superPointsRequired);
    const supersAvailable = supersEarned - gameState.superUsed;
    const superReady = supersAvailable > 0 && !gameState.superActive;

    if (superReady !== gameState.superReady) {
      updateState({ superReady: superReady }); // Esto causará un re-render
    }

    const superOrbElement = document.getElementById("superOrb");
    if (superOrbElement) {
      if (gameState.superReady) {
        superOrbElement.classList.remove("off");
      } else {
        superOrbElement.classList.add("off");
      }
    }

    // Actualizar turno del jugador (para 2 jugadores)
    const playerTurnDisplay = document.getElementById("playerTurn");
    if (playerTurnDisplay) {
      if (gameState.gameMode === 2) {
        playerTurnDisplay.textContent = `JUGADOR ${gameState.currentPlayer}`;
      } else {
        playerTurnDisplay.textContent = "";
      }
    }

  }, [
    gameState.score,
    gameState.lives,
    gameState.alienCounts,
    gameState.superReady,
    gameState.superActive,
    gameState.superUsed,
    gameState.superPointsRequired,
    gameState.gameMode,
    gameState.currentPlayer,
    updateState
  ]);

  return (
    <>
      <div className="menu" id="menu">
        <h1>SPACE INVADERS</h1>
        <button onClick={() => startGame(1)}>1 JUGADOR</button>
        <button onClick={() => startGame(2)}>2 JUGADORES</button>
      </div>

      <div className="game-container" id="gameContainer" style={{ display: 'none' }}>
        <div className="info">
          <div className="scorelives">
            <div className="score">SCORE: <span id="score">0</span></div>
            <div className="player-turn" id="playerTurn"></div>
            <div id="lives" className="lives-bar">
              <div className="life"></div>
              <div className="life"></div>
              <div className="life"></div>
            </div>
          </div>
          <button className="pause-btn" id="pauseBtn" onClick={togglePause}>
            {gameState.gamePaused ? '▶' : '⏸'}
          </button>
          
          <div className="alien-counters">
            <div className="alien-counter">
              <div className="alien-icon type3"></div>
              <span className="alien-count" id="type3Count">0 / 10</span>
            </div>
            <div className="alien-counter">
              <div className="alien-icon type2"></div>
              <span className="alien-count" id="type2Count">0 / 20</span>
            </div>
            <div className="alien-counter">
              <div className="alien-icon type1"></div>
              <span className="alien-count" id="type1Count">0 / 20</span>
            </div>
          </div>
          
          <div className="super">
            <div className={`super-orb ${gameState.superReady ? '' : 'off'}`} id="superOrb"></div>
          </div>
        </div>

        <div className="game-area" id="gameArea" ref={gameAreaRef}>
          {/* Renderizado del jugador */}
          {gameState.player && gameState.player.active && (
            <div
              key={gameState.player.id}
              className={gameState.player.className}
              style={{
                left: `${gameState.player.x}px`,
                top: `${gameState.player.y}px`,
                backgroundImage: `url("${ASSET_PATHS.player}")`,
                width: `${PLAYER_WIDTH}px`,
                height: `${PLAYER_HEIGHT}px`,
              }}
            />
          )}

          {/* Renderizado de aliens */}
          {gameState.alienGrid.map(row =>
            row.map(alien =>
              alien.active && (
                <div
                  key={alien.id}
                  className={alien.className}
                  style={{
                    left: `${alien.x}px`,
                    top: `${alien.y}px`,
                    backgroundImage: `url(${alien.image})`,
                    width: `${ALIEN_WIDTH}px`,
                    height: `${ALIEN_HEIGHT}px`,
                  }}
                />
              )
            )
          )}

          {/* Renderizado de escudos */}
          {gameState.shields.map(shield =>
            shield.active && (
              <div
                key={shield.id}
                className={shield.className}
                style={{
                  left: `${shield.x}px`,
                  top: `${shield.y}px`,
                  backgroundImage: `url("${ASSET_PATHS.shield}")`,
                  width: `${SHIELD_BLOCK_SIZE}px`,
                  height: `${SHIELD_BLOCK_SIZE}px`,
                }}
              />
            )
          )}

          {/* Renderizado de láseres del jugador */}
          {gameState.playerLasers.map(laser =>
            laser.active && (
              <div
                key={laser.id}
                className="laser"
                style={{
                  left: `${laser.x}px`,
                  top: `${laser.y}px`,
                  backgroundImage: `url("${ASSET_PATHS.laser}")`,
                  width: `${LASER_WIDTH}px`,
                  height: `${LASER_HEIGHT}px`,
                }}
              />
            )
          )}

          {/* Renderizado de láseres enemigos */}
          {gameState.enemyLasers.map(laser =>
            laser.active && (
              <div
                key={laser.id}
                className="enemy-laser"
                style={{
                  left: `${laser.x}px`,
                  top: `${laser.y}px`,
                  backgroundImage: `url("${ASSET_PATHS.enemyLaser}")`,
                  width: `${LASER_WIDTH}px`,
                  height: `${LASER_HEIGHT}px`,
                }}
              />
            )
          )}

          {/* Renderizado de power-ups */}
          {gameState.powerUps.map(powerUp =>
            powerUp.active && (
              <div
                key={powerUp.id}
                className="power-up"
                style={{
                  left: `${powerUp.x}px`,
                  top: `${powerUp.y}px`,
                  backgroundImage: `url("${ASSET_PATHS.powerUp}")`,
                  width: `${POWER_UP_SIZE}px`,
                  height: `${POWER_UP_SIZE}px`,
                }}
              />
            )
          )}

          {/* Renderizado de super beams */}
          {gameState.superBeams.map(beam =>
            beam.active && (
              <div
                key={beam.id}
                className="super-beam"
                style={{
                  left: `${beam.x}px`,
                  top: `${beam.y}px`,
                  backgroundImage: `url("${ASSET_PATHS.superBeam}")`,
                  width: `${SUPER_BEAM_WIDTH}px`,
                  height: `${SUPER_BEAM_HEIGHT}px`,
                }}
              />
            )
          )}

          {/* Renderizado de explosiones */}
          {gameState.explosions.map(explosion =>
            explosion.active && (
              <div
                key={explosion.id}
                className="boom"
                style={{
                  left: `${explosion.x}px`,
                  top: `${explosion.y}px`,
                  backgroundImage: `url("${ASSET_PATHS.explosion}")`,
                  width: `${EXPLOSION_SIZE}px`,
                  height: `${EXPLOSION_SIZE}px`,
                }}
              />
            )
          )}
        </div>
        
        <button className="restart-btn" onClick={backToMenu}>VOLVER AL MENÚ</button>
        <div className="controls">
          <p>CONTROLES: ← → mover, ↑ disparar, ESPACIO súper (cuando está listo)</p>
        </div>
      </div>
    </>
  );
};

export default SpaceInvaders;