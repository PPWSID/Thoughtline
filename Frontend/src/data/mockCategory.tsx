import { Network, Rocket, PenTool, Boxes } from 'lucide-react';
import { Category } from '../types/category';

export const mockCategory: Category[] = [
    { 
        name: 'Network', 
        path: '/?category=Network', 
        icon: <Network className="w-4 h-4" /> 
    },
    { 
        name: 'Development', 
        path: '/?category=Development', 
        icon: <Rocket className="w-4 h-4" /> 
    },
    { 
        name: 'Design', 
        path: '/?category=Design', 
        icon: <PenTool className="w-4 h-4" /> 
    },
    // { 
    //     name: 'Technology', 
    //     path: '/?category=Technology', 
    //     icon: <Cpu className="w-4 h-4" /> 
    // },
    { 
        name: 'อื่นๆ', 
        path: '/?category=others', 
        icon: <Boxes className="w-4 h-4" /> 
    },
];
