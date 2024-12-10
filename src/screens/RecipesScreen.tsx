import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';

interface Recipe {
  id: number;
  title: string;
}

export const RecipesScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme();

  const fetchRecipes = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const newPage = reset ? 0 : page;
      const response = await axios.get(`https://dummyjson.com/recipes?limit=10&skip=${newPage * 10}&q=${searchQuery}`);
      const newRecipes = response.data.recipes;
      setRecipes(reset ? newRecipes : [...recipes, ...newRecipes]);
      setPage(newPage + 1);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(true);
  }, [searchQuery]);

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <View style={[styles.recipeItem, { backgroundColor: colors.card }]}>
      <Text style={[styles.recipeTitle, { color: colors.text }]}>{item.title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
        placeholder="Search recipes..."
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => fetchRecipes()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  recipeItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});