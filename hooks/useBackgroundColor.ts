import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BackgroundColorContextType = {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
};

const BackgroundColorContext = createContext<BackgroundColorContextType | undefined>(undefined);

export const BackgroundColorProvider = ({ children }: { children: ReactNode }) => {
    const [backgroundColor, setBackgroundColor] = useState('#FCE4EC'); // Default light pink

    useEffect(() => {
        const loadBackgroundColor = async () => {
            const storedColor = await AsyncStorage.getItem('backgroundColor');
            if (storedColor) {
                setBackgroundColor(storedColor);
            }
        };
        loadBackgroundColor();
    }, []);

    const handleSetBackgroundColor = (color: string) => {
        setBackgroundColor(color);
        AsyncStorage.setItem('backgroundColor', color);
    };

    return (
        <BackgroundColorContext.Provider
            value= {{ backgroundColor, setBackgroundColor: handleSetBackgroundColor }
}
        >
    { children }
    </BackgroundColorContext.Provider>
    );
};

export const useBackgroundColor = () => {
    const context = useContext(BackgroundColorContext);
    if (context === undefined) {
        throw new Error('useBackgroundColor must be used within a BackgroundColorProvider');
    }
    return context;
}; 