import { Routes } from '@angular/router';

export const routes: Routes = [ 
    {
        path: 'formularios',
        children:[
            {
                path:'zodiaco',
                loadComponent:()=>
                    import('./formularios/zodiaco/zodiaco').then(
                        (a)=>a.Zodiaco
                    )
                    
            }
        ]
    }
];
