import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'ADMIN' | 'USER';
  };
}

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement JWT
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de autenticación requerido' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de autenticación requerido' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};
