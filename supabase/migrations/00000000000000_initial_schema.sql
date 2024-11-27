-- Create locais table
CREATE TABLE locais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create notebooks table
CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    local_id INTEGER REFERENCES locais(id) NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create entregas table
CREATE TABLE entregas (
    id SERIAL PRIMARY KEY,
    colaborador VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL,
    local_id INTEGER REFERENCES locais(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create trigger to update updated_at on notebooks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notebooks_updated_at
    BEFORE UPDATE ON notebooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for locais
INSERT INTO locais (nome) VALUES
    ('Sala de TI'),
    ('Servidor');

-- Insert initial data for notebooks
INSERT INTO notebooks (local_id, quantidade)
SELECT id, 0 FROM locais;