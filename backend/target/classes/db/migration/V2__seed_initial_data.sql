-- Flyway Migration V2: Seed Skills and Services Data

INSERT INTO skills (id, name) VALUES
('sk-1', 'React'),
('sk-2', 'TypeScript'),
('sk-3', 'Node.js'),
('sk-4', 'Python'),
('sk-5', 'Tailwind CSS'),
('sk-6', 'AI APIs'),
('sk-7', 'Figma'),
('sk-8', 'UI Design'),
('sk-9', 'TensorFlow'),
('sk-10', 'PyTorch'),
('sk-11', 'Illustrator'),
('sk-12', 'Photoshop'),
('sk-13', 'Flutter'),
('sk-14', 'React Native'),
('sk-15', 'Premiere Pro'),
('sk-16', 'After Effects');

INSERT INTO services (id, name) VALUES
('srv-1', 'BUILD A WEBSITE'),
('srv-2', 'UI/UX DESIGN'),
('srv-3', 'GRAPHIC DESIGN'),
('srv-4', 'VIDEO EDITING'),
('srv-5', 'AI PROJECT'),
('srv-6', 'MOBILE APP'),
('srv-7', 'CODING'),
('srv-8', 'POSTER / CREATIVE DESIGN');
