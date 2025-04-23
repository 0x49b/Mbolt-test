import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];
    
    let currentPath = '';
    
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      // Handle special cases for dynamic routes
      const isLast = index === pathnames.length - 1;
      let label = name.charAt(0).toUpperCase() + name.slice(1);
      
      // Replace IDs with more descriptive labels if needed
      if (name.match(/^[0-9a-fA-F-]+$/) && !isLast) {
        // This is likely an ID - we'd replace with entity name in a real app
        label = 'Details';
      }
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-1 text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={breadcrumb.path} className="flex items-center">
              {index === 0 ? (
                <Link 
                  to={breadcrumb.path}
                  className="text-gray-500 hover:text-primary-600 transition-colors flex items-center"
                >
                  <Home size={16} className="mr-1" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : (
                <>
                  <ChevronRight size={16} className="text-gray-400 mx-1" />
                  {isLast ? (
                    <span className="font-medium text-gray-800">
                      {breadcrumb.label}
                    </span>
                  ) : (
                    <Link 
                      to={breadcrumb.path}
                      className="text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;