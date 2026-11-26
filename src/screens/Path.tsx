import React from 'react';
import { ru } from '../config/i18n';

export const Path: React.FC = () => {
  return (
    <div style={{ padding: 'var(--space-xl)', paddingBottom: '100px' }}>
      <h1>{ru.nav.path}</h1>
      <p>Экран «Путь» — бамбуковый стебель с темами и уровнями</p>
    </div>
  );
};
